import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { loginUser, registerUser } from '../state/auth/authAction';
import { useAppDispatch } from '../../../app/hooks';

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterPayload = Omit<RegisterFormData, 'confirmPassword'>;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // register
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    watch: watchRegister,
    formState: { errors: errorsRegister, isSubmitting: isSubmittingRegister },
  } = useForm<RegisterFormData>({ mode: 'onChange' });

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...payload } = data;

    dispatch(registerUser(payload));
  };

  // Login
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onLoginSubmit = (data: LoginFormData) => {
    dispatch(loginUser(data));
  };

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    onLoginSubmit,
    navigate,

    // register
    registerRegister,
    handleRegisterSubmit,
    watchRegister,
    errorsRegister,
    isSubmittingRegister,
    onRegisterSubmit,
  };
};
