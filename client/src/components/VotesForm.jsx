/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import MessageContext from '../messageCtx.jsx';

function VotesForm(props) {
  const { handleErrors } = useContext(MessageContext);

  return (
    <>
      {props.loggedIn ?
       <>
          <div>SHiao bellii</div>
       </>
       : <div>You need to LOGIN!</div>}
    </>
  );
}

export default VotesForm;
