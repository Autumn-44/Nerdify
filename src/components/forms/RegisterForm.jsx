import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
      />
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;
