import React, { useState } from 'react';

const Contribute = () => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      const res = await fetch(API_BASE_URL + '/api/problems/contribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Problem submitted successfully!');
        // Reset form
        setForm({
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
      } else {
        const text = await res.text();
        alert(`Error: ${text}`);
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Contribute to Help Us Grow Better</h1>
        <h2 className="text-2xl font-semibold border-b border-neutral-700 pb-2">Question Contribution</h2>

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
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Problem Type */}
        <div>
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

        {/* Conditional Answer Inputs */}
        {form.problemType === 'Integer' ? (
          <div>
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
              <div key={idx}>
                <label className="block text-sm mb-1">Option {idx + 1}</label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
                />
              </div>
            ))}
            <div>
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

        {/* Solution Explanation */}
        <div>
          <label className="block text-sm mb-1">Solution Explanation</label>
          <textarea
            name="solution"
            rows={4}
            value={form.solution}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-neutral-700 rounded-lg px-3 py-2"
          />
        </div>

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Submit */}
        <div className="pt-4">
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

export default Contribute;
