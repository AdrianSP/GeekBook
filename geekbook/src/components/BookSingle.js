import React, { Component } from 'react';
import '../App.css';
import BookLBox from './books/BookLBox'
import AppHeader from "./Header";
import "./books/books.css";
import Lightbox from 'react-image-lightbox';
import axios from 'axios';
const queryString = require('query-string');
const today = new Date();

class BookSingle extends Component {

  constructor(props)
  {
    super(props);
    // Holds books in the DB
    this.state = {
      book: [] ,
      imgSrc: "https://source.unsplash.com/6H9H-tYPUQQ/800x600",
      lBoxOpen: false,
      buttonLabel: "ADD TO CART",
    }
  }

  componentDidMount()
  {
    var parsed = queryString.parse(this.props.location.search);
    var htmlReq = 'http://localhost:4200/books/findByISBN/' + parsed.isbn;
      axios.get(htmlReq)
      .then((response) => {
        this.setState({
          book: response.data
        });
      });
  }

  displayTitle(data)
  {
      if(data.book[0])
        return data.book[0].title;
  }

  displayDeets(data)
  {
    if(data.book[0])
    {
      return (
      <div className="col-md-6 book-single">
      <a href={"/author-view/?author=" + data.book[0].author.name}><p>{"Author: " + data.book[0].author.name}</p></a> <br/>
      <p>{"Bio: " + data.book[0].author.bio}</p> <br/>
      <p>{"Description: " + data.book[0].description}</p> <br/>
      <p>{"Genres: " + data.book[0].genres}</p> <br/>
      <p>{"Publisher: GeekBooks"}</p> <br/>
      </div>
      );
    }
  }

  displayComments(data)
  {
    if(data.book[0])
    {
      if(data.book[0].comments)
      {
        const commentList = data.book[0].comments.map((d) =>
        <div key = {d.user} className="col-md-12">
        <p> User: {d.user} Test-User</p> <br/>
        <p> Message: {d.message} </p> <br/>
        <p> Timestamp: {d.timestamp} </p>
        <hr/>
        </div>);

        return (
          <div className="row">
          {commentList}
          </div>
          );
      }
      else
      {
        return ( <p> No comments! </p> );
      }
    }
  }
  addToCart(data){
      axios.get('http://localhost:4200/cart/add-to-cart/' + data[0]._id, {withCredentials: true})
      .then((response) => {
          this.setState({
              buttonLabel: "✔ ADDED"
          }, function(){
              setTimeout(() => {
                  this.setState({ buttonLabel: "ADD TO CART" });
              }, 5000);
          });
      });
  }

  render() {
      let data = this.state.book;
    return (
      <div className = "container">
      <div className = "row">
        <div className="App">
          <AppHeader />
        </div>
      </div>
        <div className = "row">
            <div className = "col-md-12 text-center book-header">
            <b>{this.displayTitle(this.state)}</b>
            </div>
        </div>
        <hr/>
        <div className = "row details-content">
            <div className ="col-md-6 text-center">
               <button> <img id="myImg" onClick={ () => this.setState({ lBoxOpen: true }) } src= {this.state.imgSrc} width = "450" height = "600"/> </button>
            </div>
            {this.displayDeets(this.state)}
            <div className="MyButton">
            <button type="button" onClick={this.addToCart.bind(this, data)}>{this.state.buttonLabel}</button>
            </div>
        </div>
        <div className = "row">
        {
          this.state.lBoxOpen &&
            <Lightbox
                mainSrc={this.state.imgSrc}
                onCloseRequest={() => this.setState({ lBoxOpen: false })}
            />
          }
        </div>
        <div className = "row">
            <div className = "col-md-12 text-center">
            <h2><b>Comments</b></h2>
            </div>
        </div>
        <hr/>
        <div className = "comments">
            {this.displayComments(this.state)}
        </div>
      </div>
    )
  }
}

export default BookSingle;
