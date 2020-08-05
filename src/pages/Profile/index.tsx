import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import * as Yup from 'yup';

import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData): Promise<void> => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          new_password: Yup.string().when('old_password', {
            is: oldPasswordField => oldPasswordField.length > 0,
            then: Yup.string()
              .min(6, 'No mínimo 6 dígitos')
              .required('Campo obrigatório'),
          }),
          new_password_confirmation: Yup.string()
            .when('old_password', {
              is: oldPasswordField => oldPasswordField.length > 0,
              then: Yup.string().required('Campo obrigatório'),
            })
            .oneOf(
              [Yup.ref('new_password'), null],
              'Confirmação de senha incorreta',
            ),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          new_password,
          new_password_confirmation,
        } = data;

        const formData = old_password
          ? {
              name,
              email,
              old_password,
              new_password,
              new_password_confirmation,
            }
          : {
              name,
              email,
            };

        await api.put('/profile', formData).then(response => {
          updateUser(response.data);
        });

        history.push({ pathname: '/dashboard' });

        addToast({
          title: 'Perfil atualizado!',
          type: 'success',
          description:
            'Suas informaçóes do perfil foram atualizadas com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao atualizar o perfil, tente novamente',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const { files } = e.target;

      if (files) {
        const data = new FormData();
        data.append('avatar', files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            title: 'Avatar atualizado!',
            type: 'success',
            description: 'A foto do seu perfil foi alterada',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <>
      <Container>
        <header>
          <div>
            <Link to="/dashboard">
              <FiArrowLeft />
            </Link>
          </div>
        </header>

        <Content>
          <Form
            ref={formRef}
            initialData={{ name: user.name, email: user.email }}
            onSubmit={handleSubmit}
          >
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name} />
              <label htmlFor="avatar">
                <FiCamera />

                <input id="avatar" type="file" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>
            <h1>Meu Perfil</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              containerStyle={{ marginTop: '24px' }}
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />
            <Input
              name="new_password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="new_password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
            <Button type="submit">Confirmar mudanças</Button>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Profile;
