import React from 'react'
import { Book, Shelf } from "./Shelves";

const BookShelfChanger = (props) => (
    <div className="book-shelf-changer">
        <select
            onChange={(event) => props.onBookShelfChange(event.target.value, props.book)}
            defaultValue={props.book.shelf || 'move'}
        >
            <option value="move" disabled>Move to...</option>
            {props.shelves && props.shelves.map(shelf => (
                <option key={shelf.name} value={shelf.name}>{shelf.title}</option>
            ))}
        </select>
    </div>
);

export const BookRender = (props) => (
    <li>
        <div className="book">
            <div className="book-top">
                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("' + (props.book.imageLinks ? props.book.imageLinks.smallThumbnail : '') + '")' }}></div>
                {props.onBookShelfChange && (
                    <BookShelfChanger shelves={props.shelves} book={props.book} onBookShelfChange={props.onBookShelfChange} />
                )}
            </div>
            <div className="book-title">{props.book.id}</div>
            <div className="book-title" title={props.book.description}>{props.book.title}</div>
            <div className="book-authors">{props.book.authors ? props.book.authors.join(', ') : 'Unknown'}</div>
        </div>
    </li>
);

class BookShelf extends React.Component {
    static props = {
        shelf: {},
        shelves: [],
        shelvesBooks: {},
        books: []
    };

    render() {
        const { onBookShelfChange, shelvesBooks } = this.props;
        const shelf = Shelf.ofData(this.props.shelf);
        const books = this.props.books.map(book => Book.ofData(book));
        const shelves = this.props.shelves.map(shelf => Shelf.ofData(shelf));
        const shelfBooks = books.filter(book => shelvesBooks[shelf.name] && shelvesBooks[shelf.name].includes(book.id));

        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{shelf.title}</h2>
                <div className="bookshelf-books">
                    <ol className="books-grid">
                        {shelfBooks && shelfBooks.map(book => (
                            <BookRender key={book.id} book={book} shelves={shelves} onBookShelfChange={onBookShelfChange}/>
                        ))}
                    </ol>
                </div>
            </div>
        );
    }
}

export default BookShelf;