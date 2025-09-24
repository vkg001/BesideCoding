import React, { useState } from 'react';
import { API_BASE_URL } from '../Constants';

const NewProblemForm = ({ onSubmit, mode = "standalone" }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    problemType: 'Integer',
    options: ['', '', '', ''],
    answer: '',
    solution: '',
    category: '',
    subCategory: '',
    difficulty: 'Easy',
    company: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      problemType: form.problemType,
      answer: form.answer,
      solution: form.solution,
      category: form.category,
      subCategory: form.subCategory,
      difficulty: form.difficulty,
      company: form.company,
    };

    if (form.problemType === 'MCQ') {
      payload.options = form.options;
    }

    try {
      const res = await fetch(API_BASE_URL + 'api/problems/contribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Problem submitted successfully!');
      onSubmit(payload);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start pt-10 z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-xl text-white w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-center mb-4">Create New Problem</h2>

        {/* Title */}
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Problem Type */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Problem Type</label>
          <select
            name="problemType"
            value={form.problemType}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
          >
            <option value="Integer">Integer</option>
            <option value="MCQ">MCQ</option>
          </select>
        </div>

        {/* Conditional Inputs */}
        {form.problemType === 'Integer' ? (
          <div className="mt-4">
            <label className="block text-sm mb-1">Answer</label>
            <input
              type="text"
              name="answer"
              value={form.answer}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
            />
          </div>
        ) : (
          <>
            {form.options.map((opt, idx) => (
              <div key={idx} className="mt-4">
                <label className="block text-sm mb-1">Option {idx + 1}</label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
                />
              </div>
            ))}
            <div className="mt-4">
              <label className="block text-sm mb-1">Correct Answer</label>
              <input
                type="text"
                name="answer"
                value={form.answer}
                onChange={handleChange}
                className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
              />
            </div>
          </>
        )}

        {/* Solution */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Solution Explanation</label>
          <textarea
            name="solution"
            rows={4}
            value={form.solution}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Subcategory</label>
            <input
              type="text"
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Submit and Cancel Buttons in Same Row */}
        <div className="pt-6 flex gap-4 justify-end">
          {mode === 'contest' && (
            <button
              onClick={() => onSubmit(null)}
              className="bg-red-600 hover:bg-red-700 transition-all text-white font-semibold px-6 py-2 rounded-xl"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 transition-all text-white font-semibold px-6 py-2 rounded-xl"
          >
            Submit Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProblemForm;
