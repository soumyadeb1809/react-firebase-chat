import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCYBPjmDQaghRfbfvos1CRGm1dtLo0W4SI",
  authDomain: "debase-18.firebaseapp.com",
  databaseURL: "https://debase-18.firebaseio.com",
  projectId: "debase-18",
  storageBucket: "debase-18.appspot.com",
  messagingSenderId: "434905803549",
  appId: "1:434905803549:web:bf77f232ad792793650ff4"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <h1>FireChat</h1>
        <SignOut />
      </header>
      <section>
        { user ? <ChatRoom /> : <SignIn /> }
      </section>
    </div>
  );
}


function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button className='sign-in' onClick={ signInWithGoogle }>Sign in with google</button>
  );
}


function SignOut() {
  return auth.currentUser && (
    <button onClick={ () => auth.signOut() }>Sign Out</button>
  )
}


function ChatRoom() {

  const msgsRef = firestore.collection('messages');
  const query = msgsRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const dummyDiv = useRef();

  const sendMessage = async (e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await msgsRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummyDiv.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        { messages && messages.map(msg => <ChatMessage key={ msg.id } message={msg} />) }

        <div ref={ dummyDiv }></div>
      </main>

      <form onSubmit={ sendMessage }>
        <input value={ formValue } onChange={ (e) => setFormValue(e.target.value) }/>

        <button type="submit">🕊️</button>

      </form>
    </>
  );

}


function ChatMessage(props) {

  const {text, uid, photoURL} = props.message;

  const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${ messageClass }`}>

      <img src={ photoURL } />
      <p>{ text }</p>
    </div>
  )
}


export default App;
