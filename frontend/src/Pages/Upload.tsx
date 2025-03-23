import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';
import { categories } from '../Components/Categories';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !description || !category) {
            setError('Please fill all required fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const projectData = {
                title,
                description,
                category
            };

            const response = await createProject(projectData);
            
            if (response.status === 'success') {
                navigate(`/project/${response.data.id}`);
            } else {
                setError('Failed to upload project');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error uploading project');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                <h1 className="text-2xl font-bold mb-4">Please log in to upload a project</h1>
                <button
                    onClick={() => navigate('/login')}
                    className="p-3 bg-white text-black rounded-lg hover:bg-gray-300"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-black text-white py-12'>
            <h1 className='text-4xl font-bold mb-4'>Upload a Project</h1>
            <p className='mb-8'>Enter project details</p>

            {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6 max-w-md">
                    {error}
                </div>
            )}

            <form 
                onSubmit={handleSubmit}
                className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <div className='mb-6'>
                    <label htmlFor='title' className='block mb-2 text-sm font-medium'>
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Project Title'
                        className='w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none'
                        required
                    />
                </div>

                <div className='mb-6'>
                    <label htmlFor='description' className='block mb-2 text-sm font-medium'>
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Brief Description'
                        className='w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none min-h-[100px]'
                        required
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="file" className="block mb-2 text-sm font-medium">
                        Upload source code (optional)
                    </label>
                    <input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                        accept=".zip,.rar,.tar,.gz,.7z"
                    />
                    <p className="text-sm mt-2">File Max Limit: 10 MB</p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-3 mt-4 ${
                        isLoading ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
                    } rounded-lg flex justify-center items-center`}
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Upload;
