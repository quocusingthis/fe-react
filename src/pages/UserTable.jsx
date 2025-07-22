import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const defaultValues = {
  name: '',
  email: '',
  phone: '',
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm({ defaultValues });

  const onSubmit = (data) => {
    if (editIndex === null) {
      setUsers([...users, data]);
    } else {
      setUsers(users.map((u, i) => (i === editIndex ? data : u)));
      setEditIndex(null);
    }
    reset(defaultValues);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setValue('name', users[index].name);
    setValue('email', users[index].email);
    setValue('phone', users[index].phone);
  };

  const handleDelete = (index) => {
    setUsers(users.filter((_, i) => i !== index));
    if (editIndex === index) {
      reset(defaultValues);
      setEditIndex(null);
    }
  };

  const handleCancel = () => {
    reset(defaultValues);
    setEditIndex(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">User Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mb-6">
        <input
          className="border rounded px-2 py-1"
          placeholder="Name"
          {...register('name', { required: true })}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Email"
          type="email"
          {...register('email', { required: true })}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Phone"
          {...register('phone')}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            {editIndex === null ? 'Add' : 'Update'}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <table className="w-full border">
        <thead>
          <tr className="bg-blue-100">
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-2 text-gray-400">No users</td>
            </tr>
          )}
          {users.map((user, idx) => (
            <tr key={idx} className="hover:bg-blue-50">
              <td className="border px-2 py-1 text-center">{idx + 1}</td>
              <td className="border px-2 py-1">{user.name}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">{user.phone}</td>
              <td className="border px-2 py-1 flex gap-2 justify-center">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded text-xs hover:bg-yellow-500"
                  onClick={() => handleEdit(idx)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  onClick={() => handleDelete(idx)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;