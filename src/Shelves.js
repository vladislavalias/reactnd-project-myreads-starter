import React, { Component } from 'react'
import BookShelf from "./Bookshelf";
import * as BooksAPI from "./BooksAPI";
import { Link } from "react-router-dom";
import BooksApp from "./App";


export class Book {
    // allowAnonLogging: true
    // averageRating: 4
    // canonicalVolumeLink: "https://market.android.com/details?id=book-nggnmAEACAAJ"
    // categories = [];
    // 0: "COMPUTERS"
    // contentVersion: "1.2.2.0.preview.2"
    // smallThumbnail: "http://books.google.com/books/content?id=nggnmAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api"
    // thumbnail: "http://books.google.com/books/content?id=nggnmAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    // industryIdentifiers = [];
    // identifier: "9781593273897"
    // type: "ISBN_13"
    // infoLink: "https://play.google.com/store/books/details?id=nggnmAEACAAJ&source=gbs_api"
    // maturityRating: "NOT_MATURE"
    // panelizationSummary = {};
    //     containsEpubBubbles: false
    //     containsImageBubbles: false
    // previewLink: "http://books.google.com/books?id=nggnmAEACAAJ&dq=linux&hl=&cd=3&source=gbs_api"
    // printType: "BOOK"
    // publisher: "No Starch Press"
    // ratingsCount: 2
    // readingModes = {};
    //     image: false
    //     text: true
    id = '';
    description = '';
    imageLinks = {
        smallThumbnail: '',
        thumbnail: '',
    };
    pageCount = 0;
    language = '';
    publishedDate = 0;
    authors = [];
    shelf = '';
    subtitle = '';
    title = '';

    static ofData(data) {
        const book = new Book();

        book.id = data.id;
        book.description = data.description;
        book.imageLinks = data.imageLinks;
        book.pageCount = data.pageCount;
        book.language = data.language;
        book.publishedDate = data.publishedDate;
        book.authors = data.authors;
        book.shelf = data.shelf;
        book.subtitle = data.subtitle;
        book.title = data.title;

        return book;
    }
}

export class Shelf {
    id = '';
    image = '';
    name = '';
    active = false;

    static ofData(data) {
        const shelf = new Shelf();

        shelf.id = data.id;
        shelf.title = data.title;
        shelf.name = data.name;
        shelf.active = data.active;

        return shelf;
    }
}

class Shelves extends Component {
    state = {
        shelvesBooks: {},
    }

    static getDerivedStateFromProps(props, state) {
        return {
            shelvesBooks: Shelves.buildShelvesBooks(props.books, props.shelves)
        }
    }

    onBookShelfChange = (shelfName, book) => {
        BooksAPI.update(book, shelfName)
            .then((shelvesBooks) => {
                this.setState(() => ({
                    shelvesBooks: shelvesBooks,
                    books: this.putThatBookToShelf(this.props.books, shelfName, book)
                }))
            });
    }

    render() {
        const { shelvesBooks } = this.state;
        const { shelves, books } = this.props;

        return (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        {shelves.map(shelf => (
                            <BookShelf
                                key={shelf.name}
                                shelf={shelf}
                                books={books}
                                shelves={shelves}
                                shelvesBooks={shelvesBooks}
                                onBookShelfChange={this.onBookShelfChange}
                            />
                        ))}
                    </div>
                </div>
                <div className="open-search">
                    <Link to={BooksApp.PAGE_SEARCH} className='add-contact' >Add a book</Link>
                </div>
            </div>
        );
    }

    static buildShelvesBooks = (books, shelves) => {
        const searchBooksByShelfName = (shelfName, books) => {
            return books.filter((book) => book.shelf === shelfName).map(book => book.id);
        }
        const shelvesBooks = {};
        shelves.map((shelf) => shelvesBooks[shelf.name] = searchBooksByShelfName(shelf.name, books));

        return shelvesBooks;
    }

    putThatBookToShelf = (books, shelf, book) => {
        return books.map((sourceBook) => {
            if (book.id === sourceBook.id) {
                sourceBook.shelf = shelf;
            }
            return sourceBook;
        })
    }
}

export default Shelves;