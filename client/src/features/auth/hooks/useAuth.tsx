import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { loginUser } from '../state/auth/authAction';
import { useAppDispatch } from '../../../app/hooks';

export type LoginFormData = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onLoginSubmit = (data: LoginFormData) => {
    console.log(data);
    dispatch(loginUser(data));
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onLoginSubmit,
    navigate,
  };
};
