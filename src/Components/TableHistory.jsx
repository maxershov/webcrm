import React from 'react';
import ReactTable from 'react-table-6/react-table.min';
import { connect } from 'react-redux';
import { getDaysLeft } from '../App';


// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100))
}

const TableHistory = (props) => {
  const parsedData = JSON.parse(props.activityData).filter(obj => obj.code === props.code);

  return (
    <div className="tableHistory">
      <ReactTable
        className="table font_white_shadow -striped -highlight"
        previousText="Назад"
        nextText="Вперед"
        loadingText="Загрузка"
        noDataText="Нет данных"
        pageText="Страница"
        ofText="из"
        rowsText="профилей"
        data={parsedData[0].activity}
        columns={[{
          Header: 'Тип',
          accessor: 'type',
          headerClassName: 'tableHeader',
          style: { whiteSpace: 'unset' },
          width: widthForTable(20)
        }, {
          Header: 'Дата',
          accessor: 'date',
          width: widthForTable(10),
          headerClassName: 'tableHeader',
          sortMethod: (a, b) => {
            const dayA = getDaysLeft(a);
            const dayB = getDaysLeft(b);
            return (dayA === "") - (dayB === "") || +(dayA > dayB) || -(dayA < dayB);
          }
        }, {
          Header: 'Время',
          width: widthForTable(10),
          accessor: 'time',
          headerClassName: 'tableHeader'
        }, {
          Header: 'Имя',
          accessor: 'person',
          style: { whiteSpace: 'unset' },
          width: widthForTable(20),
          headerClassName: 'tableHeader'
        }, {
          Header: 'Значение',
          accessor: 'amount',
          width: widthForTable(40),
          headerClassName: 'tableHeader',
          style: { 'whiteSpace': 'unset' }
        }]}
        defaultSorted={[{ id: 'date', desc: true }]}
        defaultPageSize={10}
      />
    </div>
  )
}


const mapStateToProps = state => {
  return {
    activityData: state.activityStore.data
  }
}

export default connect(mapStateToProps)(TableHistory);