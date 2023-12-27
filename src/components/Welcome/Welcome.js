import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { parseToken, buttonStyles } from '../../lib/util';
import { Header, centeredBox } from '../Layout/Layout';
import useLocalStorage from '../../hooks/useLocalStorage';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { ArchivalNoticeModal } from '@the-collab-lab/shopping-list-utils';

const Spacer = () => <div className="my-4"></div>;

export default function Welcome() {
  const { token, setToken } = useLocalStorage();
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(null);

  const handleClick = () => {
    // const parsedToken = parseToken(getToken(words));
    // setToken(parsedToken);
    console.log('Creating new lists is no longer supported');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedUserInput = parseToken(userInput);
    const q = query(collection(db, parsedUserInput), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setError('The token you entered is not valid.');
      setUserInput('');
    } else {
      setToken(parsedUserInput);
    }
  };

  return (
    <>
      {token ? (
        <Navigate to={`/list/${token}`} replace={true} />
      ) : (
        <main className={centeredBox + ' w-3/4 pb-6 md:pt-16'}>
          <Header text="Welcome to your smart shopping list!" />
          <Spacer />
          <button className={buttonStyles} onClick={handleClick}>
            Create new list
          </button>
          <Spacer />
          <div className="text-center text-white p-4"> or </div>
          <Spacer />
          <p className="text-center text-white pb-2">
            Join an existing shopping list by entering a three word token.
          </p>
          <Spacer />
          <form
            className="flex flex-col p-6 border border-neutral rounded-md"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label
              className="text-center text-xl text-neutral"
              htmlFor="tokenInput"
            >
              Enter shared token
            </label>
            <input
              className={`my-2 rounded-md text-center border-2 ${
                error ? 'border-red-600' : 'border-neutral'
              } text-white bg-primary active:focus:border-secondary`}
              id="tokenInput"
              type="text"
              placeholder="three word token"
              aria-label="three word token"
              aria-errormessage="inputError"
              aria-invalid={error ? true : false}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              required
            />
            <button className={buttonStyles} type="submit">
              Join existing list
            </button>
            {error && <ErrorMessage error={error} id="inputError" />}
          </form>
        </main>
      )}
			<ArchivalNoticeModal />
    </>
  );
}
