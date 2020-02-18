import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import UserPage from './UserPage';
import TablePage from './TablePage';
import TablePageShort from './TablePageShort';
import MainPage from './MainPage';

import WithSpinner from './WithSpinner';

const MainPageWithSpinner = WithSpinner(MainPage);

// <Route exact path="/main" component={MainPage} />

const MainContent = props => {
  return (
    <Switch>
      <Redirect exact from="/" to="/main" />
      <Route exact path="/main" render={() => <MainPageWithSpinner isLoading={props.loading} {...props} />} />
      <Route exact path="/clients/page/:pageNum" component={TablePage} />
      <Route exact path="/lead/page/:pageNum" render={() => <TablePageShort tableType="ЛИД" />} />
      <Route exact path="/employee/page/:pageNum" render={() => <TablePageShort tableType="СОТРУДНИК" />} />
      <Route exact path="/lost/page/:pageNum" render={() => <TablePageShort tableType="НЕТ" />} />
      <Route exact path="/profile/:codeLink" component={UserPage} />
    </Switch>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.testDataStore.loading
  };
};



export default connect(mapStateToProps)(MainContent);


// export default MainContent;