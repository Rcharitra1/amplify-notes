import React from 'react';
import styled from 'styled-components';
import {AmplifySignOut } from '@aws-amplify/ui-react';

const NavBarStyled = styled.div`
    display: flex;
    p{
        flex-basis: 85%;
        color:white;
        font-weight: bold;
        margin-left:10%;
    }
    background-color: lightgrey;
    justify-content: flex-end;
`

const NavBar = ()=>{
    return(
        <NavBarStyled>
        <p>Welcome</p>
        <AmplifySignOut/>
        </NavBarStyled>
    );
}

export default NavBar;