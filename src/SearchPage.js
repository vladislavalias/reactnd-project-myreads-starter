import React, { Component } from 'react'
import { Link } from "react-router-dom";
import BooksApp from "./App";
import * as BooksAPI from "./BooksAPI";
import { BookRender } from "./Bookshelf";
import { Book } from "./Shelves";

class SearchPage extends Component {
    state = {
        search: '',
        foundBooks: []
    }

    onSearchInput = (search) => {
        this.setState(() => ({
            search: search
        }));
        if (search) {
            BooksAPI.search(search)
                .then((books) => {
                    if (!books.error) {
                        this.setState(() => ({
                            foundBooks: books && books.map(book => Book.ofData(book))
                        }));
                    } else {
                        this.setState(() => ({
                            foundBooks: []
                        }));
                    }
                });
        } else {
            this.setState(() => ({
                foundBooks: []
            }));
        }
    }

    onBookAddToShelf = (shelfName, book) => {
        BooksAPI.update(book, shelfName)
            .then((shelvesBooks) => {
                // update books
                this.setState((currentState) => ({
                    shelvesBooks: shelvesBooks,
                }))
            });
    }

    render() {
        const { foundBooks, search } = this.state;
        const { shelves, books } = this.props;
        const mergedFoundBooks = this.mergeBookShelves(foundBooks, books);

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to={BooksApp.PAGE_MAIN} className='close-search' >Close</Link>
                    <div className="search-books-input-wrapper">
                        <input
                           type="text"
                           value={search}
                           placeholder="Search by title or author"
                           onChange={(event) => this.onSearchInput(event.target.value)}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {mergedFoundBooks && mergedFoundBooks.map(book => (
                            <BookRender key={book.id} book={book} shelves={shelves} onBookShelfChange={this.onBookAddToShelf} />
                        ))}
                    </ol>
                </div>
            </div>
        );
    }

    mergeBookShelves (foundBooks, books) {
        if (foundBooks) {
            return foundBooks.map(foundBook => {
                const bookFromShelf = books.find(book => book.id === foundBook.id);
                return bookFromShelf || foundBook;
            });
        }
        return foundBooks;
    }
}

export default SearchPage;