import React from 'react';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import { withAuthenticator } from '@aws-amplify/ui-react';
import HomePage from './components/pages/Home';
import NavBar from './components/ui/NavBar';
Amplify.configure(awsExports);


function App() {
  return (
  <div>
  <NavBar/>
  <HomePage/>
  </div>
  );
}

export default withAuthenticator(App);

