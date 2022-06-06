import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import { StudentDataTabs } from "../../components";
import styles from './Pagination.module.css';

class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageNumbers: [],
    }
  }

  render() {
    for (let i=1; i<=Math.ceil(this.props.totalPosts/this.props.postsPerPage); i++) {
      this.state.pageNumbers.push(i);
    }
    
    return(
      <nav>
        <ul className='pagination'>
          {this.state.pageNumbers.map(number => {
            <li key={number} className="page-item">
              <a href='!#' className='page-link'>
                {number}
              </a>
            </li>
          })}
        </ul>
      </nav>
    );
  }
}

export default Pagination;

// class Pagination extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       pageNumbers: [],
//     }
//   }

//   render() {
//     for (let i=1; i<=Math.ceil(this.props.totalPosts/this.props.postsPerPage); i++) {
//       this.state.pageNumbers.push(i);
//     }
    
//     return(
//       <nav>
//         <ul className='pagination'>
//           {this.state.pageNumbers.map(number => {
//             <li key={number} className="page-item">
//               <a href='!#' className='page-link'>
//                 {number}
//               </a>
//             </li>
//           })}
//         </ul>
//       </nav>
//     );
//   }
// }


// const { data } = props;
// const [currentItems, setCurrentItems] = useState(null);
// const [pageCount, setPageCount] = useState(0);
// const [itemOffset, setItemOffset] = useState(0);
// const itemsPerPage = 10;

// useEffect(() => {
//   const endOffset = itemOffset + itemsPerPage;
//   console.log(`Loading items from ${itemOffset} to ${endOffset}`);
//   setCurrentItems(data.slice(itemOffset, endOffset));
//   setPageCount(Math.ceil(Math.ceil(data.length/itemsPerPage)));
// }, [itemOffset, itemsPerPage, data]);

// // Invoke when user click to request another page.
// const handlePageClick = (event) => {
//   const newOffset = (event.selected * itemsPerPage) % data.length;
//   setItemOffset(newOffset);
// };

// return (
//   <>
//     {/* <Items currentItems={currentItems} /> */}
//     <div className={styles.list}>
//       {currentItems.map((student, i) => {
//         return(
//           <StudentDataTabs 
//             key={i}
//             data={student}
//           />
//         )})
//       }
//     </div>
//     <ReactPaginate
//       breakLabel="..."
//       nextLabel="next >"
//       onPageChange={handlePageClick}
//       pageRangeDisplayed={5}
//       pageCount={pageCount}
//       previousLabel="< previous"
//       renderOnZeroPageCount={null}
//       containerClassName="pagination"
//       pageLinkClassName='page-num'
//       previousLinkClassName="page-num"
//       nextLinkClassName="page-num"
//       activeLinkClassName="active"
//     />
//   </>
// );


// const { data } = props;
// const [students, setStudents] = useState(data.slice(0, 50));
// const [pageNumber, setPageNumber] = useState(0);

// const usersPerPage = 10;
// const pagesVisited = pageNumber * usersPerPage;

// const displayStudents = students
//   .slice(pagesVisited, pagesVisited + usersPerPage)
//   .map((student, i) => {
//     return (
//       <StudentDataTabs 
//         key={i}
//         data={student}
//       />
//     );
//   });

// const pageCount = Math.ceil(students.length / usersPerPage);

// const changePage = ({ selected }) => {
//   setPageNumber(selected);
// };

// return (
//   <div className="App">
//     {displayStudents}
//     <ReactPaginate
//       previousLabel={"Previous"}
//       nextLabel={"Next"}
//       pageCount={pageCount}
//       onPageChange={changePage}
//       containerClassName={"paginationBttns"}
//       previousLinkClassName={"previousBttn"}
//       nextLinkClassName={"nextBttn"}
//       disabledClassName={"paginationDisabled"}
//       activeClassName={"paginationActive"}
//     />
//   </div>
// );












// const pageNumbers = [];

// for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
//   pageNumbers.push(i);
// }

// return (
//   <nav>
//     <ul className='pagination'>
//       {pageNumbers.map(number => (
//         <li key={number} className='page-item'>
//           <a onClick={() => paginate(number)} href='!#' className='page-link'>
//             {number}
//           </a>
//         </li>
//       ))}
//     </ul>
//   </nav>
// );