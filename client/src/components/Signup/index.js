// src/components/Signup/index.js
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'redux-react-hook';
import { withRouter } from 'react-router-dom';
import * as actions from '../../constants/action_types';
import * as routes from '../../constants/routes';

const Signup = (props) => {
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
                mutation {
                    createUser(userInput: {
                        email: "${email}"
                        password: "${password}"
                        confirm: "${confirm}"
                    }) {
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
      console.log('signup:', data);

      if (data.errors) {
        setError(data.errors[0].message);
        setLoading(false);
        console.log(data.errors[0].message);
      } else {
        setError(null);
        setLoading(false);
        const { _id, token } = await data.data.createUser;

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
      console.log(e);
    }
  };

  return (
    <div>
      <h1>Sign up</h1>
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
            className="form-input"
            type="password"
            placeholder="Confirm password"
            onChange={handleChange(setConfirm)}
          />
          <input
            className="form-submit"
            type="submit"
            value={loading ? 'Verifying...' : 'Register'}
          />
        </form>
      </div>
    </div>
  );
};

export default withRouter(Signup);
