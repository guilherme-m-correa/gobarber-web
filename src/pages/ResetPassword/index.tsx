import React, { useRef, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FiLock } from 'react-icons/fi';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import useQuery from '../../hooks/query';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface ResetPasswordFormData {
  new_password: string;
  new_password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const query = useQuery();
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData): Promise<void> => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          new_password: Yup.string().required('Senha obrigatória'),
          new_password_confirmation: Yup.string().oneOf(
            [Yup.ref('new_password'), null],
            'As senhas não são iguais',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const token = query.get('token');

        const { new_password, new_password_confirmation } = data;

        await api.post('/password/reset', {
          new_password,
          new_password_confirmation,
          token,
        });

        addToast({
          type: 'success',
          title: 'Senha resetada',
          description: 'Sua senha foi resetada com sucesso',
        });

        history.push({ pathname: '/' });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history, query],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Resetar senha</h1>
              <Input
                name="new_password"
                icon={FiLock}
                type="password"
                placeholder="Senha"
              />
              <Input
                name="new_password_confirmation"
                icon={FiLock}
                type="password"
                placeholder="Confirmar senha"
              />
              <Button loading={loading} type="submit">
                Alterar senha
              </Button>
            </Form>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ResetPassword;
