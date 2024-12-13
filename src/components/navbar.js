import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({role}) {

    return (
        <nav>
        {role === 'student' && <Link to ="/student">student</Link>}
        {role === 'teacher' && <Link to ="/teacher">teacher</Link>}
        {role === 'admin' && <Link to ="/admin">admin</Link>}
        </nav>
    );
}
