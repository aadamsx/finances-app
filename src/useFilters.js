import moment from "moment";
import { useState } from "react";

export default function useFilters() {
  const [myFilters, _setMyFilters] = useState(
    (JSON.parse(window.localStorage.getItem("myFilters")) || []).map((f) => {
      return {
        ...f,
        minDate: moment(f.minDate, moment.defaultFormatUtc),
        maxDate: moment(f.maxDate, moment.defaultFormatUtc),
      };
    })
  );

  function setMyFilters(fs) {
    window.localStorage.setItem("myFilters", JSON.stringify(fs));
    _setMyFilters(fs);
  }

  function saveFilter(f) {
    setMyFilters([...myFilters, f]);
  }

  function toggleFilter(f) {
    setMyFilters(
      myFilters.map((ff) =>
        ff.id !== f.id ? ff : { ...f, enabled: !f.enabled }
      )
    );
  }

  function deleteFilter(f) {
    setMyFilters(myFilters.filter((ff) => ff.id !== f.id));
  }

  return {
    myFilters,
    saveFilter,
    toggleFilter,
    deleteFilter,
  };
}
