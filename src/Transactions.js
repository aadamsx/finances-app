import {
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";

function formatMoney(s) {
  return Number(s).toFixed(2);
}
export default function Transactions({
  transactions,
  ignore,
  select,
  setCategory,
}) {
  const ref = useRef();
  const [page, setPage] = useState(1);
  const perPage = 50;

  const orderedTransactions = useMemo(
    () =>
      transactions.sort((t1, t2) => {
        return t1.id.localeCompare(t2.id);
      }),
    [transactions]
  );

  const transactionsInPage = orderedTransactions.slice(
    (page - 1) * perPage,
    page * perPage
  );
  console.log({ transactionsInPage });

  function onPageChange(e, v) {
    setPage(v);
    ref.current.scrollTo(0, 0);
  }

  return (
    <Stack
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <TableContainer ref={ref}>
        <Table
          stickyHeader
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionsInPage.map((t, i) => {
              let rowColor = t.ignored ? "gray" : "black";
              return (
                <TableRow
                  key={t.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell sx={{ color: rowColor }} align="right">
                    {(page - 1) * perPage + i + 1}
                  </TableCell>
                  <TableCell sx={{ color: rowColor }} align="left">
                    {t.date.format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell sx={{ color: rowColor }} align="left">
                    {t.categ}
                  </TableCell>
                  <TableCell sx={{ color: rowColor }} align="right">
                    {t.memo}
                  </TableCell>
                  <TableCell
                    sx={{ color: t.amount > 0 ? "darkgreen" : "black" }}
                    align="right"
                  >
                    {formatMoney(t.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ p: 2 }}
        count={Math.ceil(transactions.length / perPage)}
        page={page}
        onChange={onPageChange}
      />
    </Stack>
  );
}
