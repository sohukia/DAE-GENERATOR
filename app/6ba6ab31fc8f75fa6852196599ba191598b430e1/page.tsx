"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';

interface Course {
  course_code: string;
  natural_name: string;
  time: string;
  evaluation: boolean;
}

interface FormData {
  full_name: string;
  promo_year: number;
  apprenticeship: boolean;
  major: string;
  td_group: string;
  absence_day: string;
  courses: Course[];
  reason: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    promo_year: new Date().getFullYear(),
    apprenticeship: false,
    major: '',
    td_group: '',
    absence_day: '',
    courses: [{ course_code: '', natural_name: '', time: '', evaluation: false }],
    reason: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : null,
    }));
  };

  const handleAddCourse = () => {
    if (formData.courses.length < 5) {
      setFormData((prevState) => ({
        ...prevState,
        courses: [...prevState.courses, { course_code: '', natural_name: '', time: '', evaluation: false }],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      console.error('Failed to generate document');
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
      <div className="container mx-auto py-12 space-y-12">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            {/* Header */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Générateur de DAE</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Cet outil est réservé à un usage exclusif des membres de l'association BDE Efrei Campus Paris.
              </p>
            </div>

            {/* Start filling informations */}
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-7">
                <div className="sm:col-span-3">
                  <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Nom complet
                  </label>
                  <div className="mt-2">
                    <input type="text"
                           name="full_name"
                           value={formData.full_name}
                           onChange={handleChange}
                           autoComplete="given-name"
                           className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                           placeholder={'John Doe'}
                           required />
                  </div>
                </div>

                <div className="sm:col-span-4" />

                {/* Promo Year */}
                <div className="sm:col-span-1">
                  <label htmlFor="promo_year" className="block text-sm font-medium leading-6 text-gray-900">
                    Promo
                  </label>
                  <div className="mt-2">
                    <input
                        type="number"
                        name="promo_year"
                        value={formData.promo_year}
                        min={new Date().getFullYear() - 5}
                        max={new Date().getFullYear() + 5}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                  </div>
                </div>

                {/* Apprenticeship */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    En apprentissage ?
                  </label>
                  <div className="mt-2">
                    <input
                        type="checkbox"
                        name="apprenticeship"
                        checked={formData.apprenticeship}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Majeure
                  </label>
                  <div className="mt-2">
                    <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        placeholder={"Laisser vide si cycle prépa"}/>
                  </div>
                </div>

                {/* TD Group */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Groupe TD
                  </label>
                  <div className="mt-2">
                    <input
                        type="text"
                        name="td_group"
                        value={formData.td_group}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        placeholder={"int-3"}/>
                  </div>
                </div>

                {/* Absence Day */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Jour d'absence
                  </label>
                  <div className="mt-2">
                    <input
                        type="date"
                        name="absence_day"
                        value={formData.absence_day}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"/>
                  </div>
                </div>

                {/* Reason */}
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Raison de l'absence (mission BDE)
                  </label>
                  <div className="mt-2">
                    <input
                        type="text"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        placeholder={"Description de la raison"}/>
                  </div>
                </div>

                <div className="sm:col-span-1" />

                {/* Courses */}
                <div className="sm:col-span-7 border border-solid border-2 rounded-md px-2 pb-5">
                  <ul role="list" className="divide-y divide-gray-100">
                    {formData.courses.map((course, index) => (
                        <li key={index} className="justify-between gap-x-6 py-5 grid grid-cols-1 sm:grid-cols-7">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Code du cours
                            </label>

                            <input
                                type="text"
                                name={`course_code_${index}`}
                                value={course.course_code}
                                onChange={(e) => {
                                  const updatedCourses = [...formData.courses];
                                  updatedCourses[index].course_code = e.target.value;
                                  setFormData({ ...formData, courses: updatedCourses });
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                placeholder={"SM101I"}/>
                          </div>


                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Nom du cours
                            </label>
                            <input
                                type="text"
                                name={`natural_name_${index}`}
                                value={course.natural_name}
                                onChange={(e) => {
                                  const updatedCourses = [...formData.courses];
                                  updatedCourses[index].natural_name = e.target.value;
                                  setFormData({ ...formData, courses: updatedCourses });
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                placeholder={"Algèbre générale"}/>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Horaire
                            </label>
                            <input
                                type="text"
                                name={`time_${index}`}
                                value={course.time}
                                onChange={(e) => {
                                  const updatedCourses = [...formData.courses];
                                  updatedCourses[index].time = e.target.value;
                                  setFormData({ ...formData, courses: updatedCourses });
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                placeholder={"de 8h à 10h"}/>
                          </div>
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Évaluation
                            </label>
                            <input
                                type="checkbox"
                                name={`evaluation_${index}`}
                                checked={course.evaluation}
                                onChange={(e) => {
                                  const updatedCourses = [...formData.courses];
                                  updatedCourses[index].evaluation = e.target.checked;
                                  setFormData({ ...formData, courses: updatedCourses });
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                          </div>
                        </li>
                    ))}
                  </ul>
                  <button
                      type="button"
                      onClick={handleAddCourse}
                      disabled={formData.courses.length>= 5}
                      className="inline-flex items-center rounded-md bg-green-50 disabled:bg-gray-50 px-2 py-1 text-xs font-medium text-green-700 disabled:text-gray-600 ring-1 ring-inset ring-green-600/20 disabled:ring-gray-500/10">
                    Add Course
                  </button>
                </div>
                {/* You can add similar file inputs for other signatures as needed */}
                <div className="col-span-full">
                  <button type="submit"
                          className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-m font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                    Générer la DAE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
  );
}

