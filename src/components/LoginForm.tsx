import { useNavigate } from 'react-router';
import useForm from '../hooks/formHooks';
import { useAuthentication } from '../hooks/apiHooks';
import type { Credentials } from '../types/LocalTypes';

const LoginForm = () => {
  const navigate = useNavigate();
  const { postLogin } = useAuthentication();

  const initValues = {
    username: '',
    password: '',
  };

  const doLogin = async (formInputs: Record<string, string>) => {
    try {
      const result = await postLogin(formInputs as unknown as Credentials);
      console.log('Server response:', result);
      
      localStorage.setItem('token', result.token);
      navigate('/');
    } catch (error) {
      console.error('Error during login:', (error as Error).message);
      alert('Login failed. Check your username and password.');
    }
  };

  const { handleInputChange, handleSubmit } = useForm(doLogin, initValues);

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginusername">Username</label>
          <input
            name="username"
            type="text"
            id="loginusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;