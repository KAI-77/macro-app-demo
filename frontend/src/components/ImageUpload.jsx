import React, { useState} from 'react'
import axios from 'axios'

export default function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }
    const formData = new FormData();
    formData.append('image', selectedFile)

    setLoading(true);

    try {
        const response = await axios.post('http://localhost:5000/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        setAnalysis(response.data)
    } catch (error) {
        console.error('Error analyzing image:', error)
    }
    setLoading(false)




    }

    return (
        <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-4'>
                Analyze Food Image
            </h2>
            <input type="file"
            accept='image/*'
            onChange={handleFileChange}
            className='mb-4 block w-full text-sm text-gray-500 file:mr-4 file: py-2 file:px-4 file: rounded-full file: border-0 file:text-sm file:font-semibold file: bg-blue-50 hover: file:bg-blue-100  file:text-blue-700'/>
            <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors'
            >
                {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
        {analysis && (
            <div className='mt-6'> 
                <h3 className='font-bold text-lg mb-2'>Food Analyis Results:</h3>
                <pre className='whitespace-pre-wrap bg-gray-50 p-4 rounded'>
                {analysis.results}
                </pre>
                {analysis.image && (
                    <img src="{analysis.image}" alt="Analyzed Food"
                    className='mt-4 max-w-full-rounded' />
                )}
            </div>
        )}
            
        </div>



    )














}