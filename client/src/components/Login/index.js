// src/components/Login/index.js
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'redux-react-hook';
import { withRouter } from 'react-router-dom';
import * as actions from '../../constants/action_types';
import * as routes from '../../constants/routes';

const Login = (props) => {
  const dispatch = useDispatch();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirm, setConfirm ] = useState('');
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        _id
                        token
                        email
                    }
                }
            `,
      };

      const { data } = await axios.post(
        'http://localhost:5000/graphql',
        requestBody,
      );

      console.log('login:', data);
      if (data.errors) {
        setError(data.errors[0].message);
        setLoading(false);
      } else {
        setError(null);
        setLoading(false);
        const { _id, token } = await data.data.login;

        dispatch({
          type: actions.SET_AUTH_USER,
          authUser: {
            _id,
            email,
          },
        });
        localStorage.setItem('token', token);
        props.history.push(routes.HOME);
      }
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div className="auth-form">
        <form onSubmit={submit}>
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            onChange={handleChange(setEmail)}
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            onChange={handleChange(setPassword)}
          />
          <input
            className="form-submit"
            type="submit"
            value={loading ? 'Verifying...' : 'Login'}
          />
        </form>
      </div>
    </div>
  );
};
export default Login;
