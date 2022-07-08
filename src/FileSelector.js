import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import {
  useCsvColumnsConfig,
  CsvColumnsPreviewAndConfig,
} from "./CsvColumnsPreviewAndConfig";
import { parseCSV } from "./utils";

export default function FileSelector({
  open,
  setOpen,
  setTransactions,
  setOpenFiles,
}) {
  const [erasePrevious, setErasePrevious] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesFormat, setSelectedFilesFormat] = useState("nubank cc");
  const [csvColumnsConfig, setCsvColumnsConfig] = useCsvColumnsConfig();

  async function loadFiles() {
    if (selectedFiles.length === 0) {
      console.info("no files added");
      return;
    }

    let newFiles = [];
    let newTransactions = [];
    for (let f of selectedFiles) {
      const fileId = nanoid(10);

      const fileContents = await f.text();
      const fileTransactions = parseCSV(fileContents).map((t, i) => {
        switch (selectedFilesFormat) {
          case "nubank credit card":
            return {
              amount: -Number.parseFloat(t[3]),
              date: moment(t[0], "YYYY-MM-DD"),
              memo: t[2],
              categ: t[1] || "?",
              sequence: i,
              fileId: fileId,
              fileName: f.name,
              id: nanoid(),
              ignored: false,
            };
          case "nubank account":
            return {
              amount: Number.parseFloat(t[1]),
              date: moment(t[0], "DD/MM/YYYY"),
              memo: t[3],
              categ: "?",
              sequence: i,
              fileId: fileId,
              fileName: f.name,
              id: nanoid(),
              ignored: false,
            };
          default:
            console.error(`file format "${selectedFilesFormat}" unknown`);
            return null;
        }
      });

      const newFile = {
        id: fileId,
        name: f.name,
        format: selectedFilesFormat,
        numTransactions: fileTransactions.length,
      };

      newFiles.push(newFile);
      newTransactions = newTransactions
        .concat(fileTransactions)
        .filter((t) => !Number.isNaN(t.amount));
    }

    if (erasePrevious) {
      setOpenFiles(newFiles);
      setTransactions(newTransactions);
    } else {
      setOpenFiles((o) => {
        return [...o, newFiles];
      });
      setTransactions((u) => {
        return [...u, ...newTransactions];
      });
    }

    setOpen(false);
  }

  return (
    <Dialog
      aria-labelledby="file-selector-title"
      aria-describedby="file-selector-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>Select files</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            overflowY: "scroll",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Input
            sx={{ marginBottom: 3 }}
            onChange={(e) => setSelectedFiles(e.target.files)}
            id="fileInput"
            inputProps={{ multiple: true }}
            type="file"
          ></Input>

          <CsvColumnsPreviewAndConfig
            {...{ csvColumnsConfig, setCsvColumnsConfig }}
            file={selectedFiles.length > 0 ? selectedFiles[0] : null}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={erasePrevious}
                  onChange={(e) => setErasePrevious(e.target.checked)}
                />
              }
              label="Erase previously loaded transactions"
            ></FormControlLabel>
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button onClick={() => setOpen(false)}>Close</Button>
        <Button variant="contained" onClick={() => loadFiles()}>
          Load
        </Button>
      </DialogActions>
    </Dialog>
  );
}
