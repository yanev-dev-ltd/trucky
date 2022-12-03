import { type NextPage } from "next";
import Head from "next/head";
import { Button } from '@mui/material'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Trucky</title>
      </Head>
      <main>
        <h1>Hello world</h1>
        <Button onClick={() => signOut(auth)}>Logout</Button>
      </main>
    </>
  );
};

export default Home;
