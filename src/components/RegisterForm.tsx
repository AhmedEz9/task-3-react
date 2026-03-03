import useForm from '../hooks/formHooks';
import { useAuthentication } from '../hooks/apiHooks';

const RegisterForm = () => {
  const { postRegister } = useAuthentication();

  const initValues = {
    username: '',
    password: '',
    email: '',
  };

  const doRegister = async (formInputs: Record<string, string>) => {
    try {
      console.log('Sending registration data:', formInputs);
      const result = await postRegister(formInputs);
      console.log('Server response:', result);
      alert('Registration successful! You can now log in above.');
    } catch (error) {
      console.error('Registration error:', (error as Error).message);
      alert('Registration failed. Username might already be taken.');
    }
  };

  const { handleInputChange, handleSubmit } = useForm(doRegister, initValues);

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="regusername">Username</label>
          <input
            name="username"
            type="text"
            id="regusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="regpassword">Password</label>
          <input
            name="password"
            type="password"
            id="regpassword"
            onChange={handleInputChange}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label htmlFor="regemail">Email</label>
          <input
            name="email"
            type="email"
            id="regemail"
            onChange={handleInputChange}
            autoComplete="email"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default RegisterForm;