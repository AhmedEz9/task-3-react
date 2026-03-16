import { useState } from 'react';
import useForm from '../hooks/formHooks';
import { useAuthentication } from '../hooks/apiHooks';

const RegisterForm = () => {
  const { postRegister, getUsernameAvailable, getEmailAvailable } = useAuthentication();
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [emailAvailable, setEmailAvailable] = useState<boolean>(true);

  const initValues = {
    username: '',
    password: '',
    email: '',
  };

  const doRegister = async (formInputs: Record<string, string>) => {
    try {
      const uAvailable = await getUsernameAvailable(formInputs.username);
      const eAvailable = await getEmailAvailable(formInputs.email);

      setUsernameAvailable(uAvailable);
      setEmailAvailable(eAvailable);

      if (!uAvailable || !eAvailable) {
        return; 
      }

      console.log('Sending registration data:', formInputs);
      const result = await postRegister(formInputs);
      console.log('Server response:', result);
      alert('Registration successful! You can now log in above.');
    } catch (error) {
      console.error('Registration error:', (error as Error).message);
      alert('Registration failed. Something went wrong.');
    }
  };

  const { handleInputChange, handleSubmit } = useForm(doRegister, initValues);

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="regusername">Username</label>
          <input
            name="username"
            type="text"
            id="regusername"
            onChange={handleInputChange}
            autoComplete="username"
            className="border p-1 ml-2"
          />
          {}
          {!usernameAvailable && (
            <p className="text-red-500 text-sm mt-1">Username is already taken.</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="regpassword">Password</label>
          <input
            name="password"
            type="password"
            id="regpassword"
            onChange={handleInputChange}
            autoComplete="new-password"
            className="border p-1 ml-2"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="regemail">Email</label>
          <input
            name="email"
            type="email"
            id="regemail"
            onChange={handleInputChange}
            autoComplete="email"
            className="border p-1 ml-2"
          />
          {}
          {!emailAvailable && (
            <p className="text-red-500 text-sm mt-1">Email is already taken.</p>
          )}
        </div>
        
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Register
        </button>
      </form>
    </>
  );
};

export default RegisterForm;