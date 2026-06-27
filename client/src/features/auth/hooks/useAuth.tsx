import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { loginUser, registerUser } from '../state/auth/authAction';
import { useAppDispatch } from '../../../app/hooks';
import toast from 'react-hot-toast';

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

  const onRegisterSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...payload } = data;

    const resultAction = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.message);
      navigate('/home');
    } else if (registerUser.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      toast.error(errorMsg);
    }
  };

  // Login
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onLoginSubmit = async (data: LoginFormData) => {
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.message);
      navigate('/home');
    } else if (loginUser.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      toast.error(errorMsg);
    }
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
