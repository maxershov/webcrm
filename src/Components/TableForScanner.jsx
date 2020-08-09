import { h } from "preact";
import { useEffect, useState } from 'preact/compat';
import ReactTable from "react-table-6/react-table.min";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getIndexByCode } from "../App";


const TableForScanner = () => {
  const personData = useSelector(state => state.personsStore.data);
  const historyData = useSelector(state => state.activitiesStore.data);
  const history = useHistory();
  const [widthCoeff, setWidthCoeff] = useState(window.innerWidth / 100);

  function handleResize() {
    setWidthCoeff(window.innerWidth / 100);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="table__main-page">
      <ReactTable
        className="table -striped -highlight"
        previousText="Назад"
        nextText="Вперед"
        loadingText="Загрузка"
        noDataText="Нет данных"
        pageText="Страница"
        ofText="из"
        rowsText="профилей"
        data={historyData}
        columns={[
          {
            Header: "Фото",
            width: widthCoeff * 10,
            accessor: "code",
            headerClassName: "table__header",
            Cell: ({ value }) => (
              <input
                className="person-img"
                type="image"
                alt="tablePhoto"
                onClick={() => history.push(`/profile/${value}`)}
                src={`/images/${personData[getIndexByCode(value)]?.photoId ?? "0.jpg"}`}
              />
            )
          },
          {
            Header: 'Имя',
            accessor: 'code',
            width: widthCoeff * 60,
            headerClassName: 'table__header',
            style: { whiteSpace: 'unset' },
            Cell: ({ value }) => (<Link to={`/profile/${value}`}>{personData[getIndexByCode(value)]?.personName ?? value}</Link>)
          },
          {
            Header: "Время",
            width: widthCoeff * 30,
            accessor: "time",
            headerClassName: "table__header"
          }
        ]}
        defaultSorted={[
          {
            id: "time",
            desc: true
          }
        ]}
        defaultPageSize={5}
      />
    </div>
  );
}


export default TableForScanner;