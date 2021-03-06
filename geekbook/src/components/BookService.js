import axios from 'axios';

class BookService {

    getBooks(){
      return axios.get('http://localhost:4200/books')
      .then(function(response) {
        return {
          bookList: response.data
        }
      });
    }

}

export default BookService;
