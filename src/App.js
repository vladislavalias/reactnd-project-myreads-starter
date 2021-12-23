import React, { Component } from 'react'
import './App.css'
import {Link, Route, Routes} from "react-router-dom";
import SearchPage from "./SearchPage";
import Shelves, {Book, Shelf} from "./Shelves";
import * as BooksAPI from "./BooksAPI";


class BooksApp extends Component {
  static PAGE_MAIN = '/';
  static PAGE_SEARCH = '/search';

  state = {
    books: [],
    shelves: [],
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          books: books && books.map(book => Book.ofData(book)),
        }))
      });
    BooksAPI.shelves()
      .then((shelves) => {
        this.setState(() => ({
          shelves: shelves && shelves.map(shelf => Shelf.ofData(shelf))
        }))
      });
  }

  render() {
    const { shelves, books } = this.state;

    return (
      <div className="app">
        <Routes>
          <Route path={BooksApp.PAGE_SEARCH} element={
              <SearchPage shelves={shelves} books={books} />
          } />
          <Route exact path={BooksApp.PAGE_MAIN} element={
            <div>
              <Shelves shelves={shelves} books={books} />
            </div>
          } />
          <Route path="*" element={
            <div>
                There is no such page, sorry.
                Please reach
                <ol>
                    <li><Link to={BooksApp.PAGE_MAIN}>Main page</Link></li>
                    <li><Link to={BooksApp.PAGE_SEARCH}>Search page</Link></li>
                </ol>
            </div>
          } />
        </Routes>
      </div>
    )
  }
}

export default BooksApp
