'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

type ProfileFormData = {
  email: string;
  username: string;
  bio: string;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    other: string;
  };
  occupation: string;
  extended: string;
  phone: string;
  dob: string;
  address: string;
  profilePhoto: FileList;
};

export default function ProfileEditPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const [submittedData, setSubmittedData] = useState<ProfileFormData | null>(null);

  const onSubmit = (data: ProfileFormData) => {
    setSubmittedData(data);
    console.log('Form Submitted:', data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="email" placeholder="Email ID" {...register("email", { required: true })} className="input" />
        <input type="text" placeholder="Username" {...register("username", { required: true })} className="input" />
        <textarea placeholder="Short bio" {...register("bio")} className="input" />

        <div className="grid grid-cols-2 gap-4">
          <input type="url" placeholder="Instagram" {...register("social.instagram")} className="input" />
          <input type="url" placeholder="Facebook" {...register("social.facebook")} className="input" />
          <input type="url" placeholder="Twitter" {...register("social.twitter")} className="input" />
          <input type="url" placeholder="LinkedIn" {...register("social.linkedin")} className="input" />
          <input type="url" placeholder="Other" {...register("social.other")} className="input" />
        </div>
 
        <select {...register("occupation", { required: true })} className="input">
          <option value="">Select Occupation</option>
          <option value="working">Working</option>
          <option value="student">Student</option>
          <option value="self-employed">Self Employed</option>
        </select>

        <input type="text" placeholder="Organization / Institute" {...register("extended")} className="input" />
        <input type="text" placeholder="Phone Number (Blurred for privacy)" {...register("phone")} className="input" />
        <input type="date" placeholder="Date of Birth" {...register("dob")} className="input" />
        <input type="text" placeholder="Address" {...register("address")} className="input" />
        <input type="file" {...register("profilePhoto")} accept="image/*" className="input" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>

      {submittedData && (
        <div className="mt-8 p-4 bg-green-100 rounded">
          <h2 className="font-semibold mb-2">Form Submitted Successfully!</h2>
          <pre className="text-sm">{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}