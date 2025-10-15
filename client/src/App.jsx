import React, { useState, useCallback } from 'react';

// --- Helper Functions ---
// Función para convertir una URL de imagen local a un objeto File
const imageUrlToFile = async (imageUrl, fileName) => {
    try {
        // Asegurarse de que la URL sea absoluta para el servidor de desarrollo
        const fullUrl = new URL(imageUrl, window.location.origin).href;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        console.error('Error loading image:', error);
        throw new Error('No se pudo cargar la imagen del producto');
    }
}

const ProductCard = ({ product, onSelect }) => (
    <div 
        className="cursor-pointer group border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
        onClick={() => onSelect(product)}
    >
        <div className="overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-4 bg-white">
            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
        </div>
    </div>
);
const Spinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
);



// Main Application Component
export default function App() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userImageFile, setUserImageFile] = useState(null); // file object for preview and sending
    const [generatedImage, setGeneratedImage] = useState(null); // base64 string for result
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const catalog = [
        { id: 1, name: 'T-shirt "Cosmic Dream"', price: 29.99, imageUrl: '/src/assets/images/01.jpeg' },
        { id: 2, name: 'T-shirt "Retro Wave"', price: 25.00, imageUrl: '/src/assets/images/02.jpg' },
        { id: 3, name: 'T-shirt "Urban Jungle"', price: 32.50, imageUrl: '/src/assets/images/03.jpeg' },
        { id: 4, name: 'T-shirt "Minimalist"', price: 22.00, imageUrl: '/src/assets/images/04.jpeg' },
        { id: 5, name: 'T-shirt "Minimalist"', price: 22.00, imageUrl: '/src/assets/images/04.jpeg' },
        { id: 6, name: 'T-shirt "Minimalist"', price: 22.00, imageUrl: '/src/assets/images/04.jpeg' },
        { id: 7, name: 'T-shirt "Minimalist"', price: 22.00, imageUrl: '/src/assets/images/04.jpeg' },
    ];
    
    // --- Event Handlers ---
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUserImageFile(file);
            setGeneratedImage(null);
            setError(null);
        }
    };

    const handleBackToCatalog = () => {
        setSelectedProduct(null);
        setUserImageFile(null);
        setGeneratedImage(null);
        setError(null);
    };

    // --- **MODIFICADO** Llamada a nuestro Backend ---
    const generateTryOnImage = useCallback(async () => {
        if (!userImageFile || !selectedProduct) {
            setError("Por favor, selecciona un producto y sube tu imagen primero.");
            return;
        }

        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        console.log('Iniciando proceso de generación:', {
            userImage: userImageFile.name,
            selectedProduct: selectedProduct.name,
            productImageUrl: selectedProduct.imageUrl
        });

        // Usamos FormData para enviar archivos al backend
        const formData = new FormData();
        formData.append('userImage', userImageFile);
        
        // Convertimos la URL de la imagen del producto a un archivo antes de enviarla
        const productFile = await imageUrlToFile(selectedProduct.imageUrl, 'product.png');
        formData.append('productImage', productFile);

        try {
            // La URL ahora apunta a nuestro servidor de Node.js
            const apiUrl = 'http://localhost:3001/api/generate-try-on';

            console.log('Preparando imágenes para enviar...');
            console.log('FormData contiene:', {
                userImage: formData.get('userImage')?.name,
                productImage: formData.get('productImage')?.name
            });

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error || `Error del servidor: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success && result.imageData) {
                // El backend nos devuelve la imagen en base64 y el mimeType
                const mime = result.mimeType || 'image/png';
                setGeneratedImage(`data:${mime};base64,${result.imageData}`);
            } else {
                throw new Error(result.error || "No se recibió respuesta del servidor.");
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userImageFile, selectedProduct]);


    // --- Render Logic (Sin cambios significativos, se muestra la estructura) ---
    if (!selectedProduct) {
        return (
            <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">CATALOGO</h1>
                    <p className="text-lg text-gray-600 mt-2">Selecciona una playera de nuestro catalogo.</p>
                </header>
                <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {catalog.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                    ))}
                </main>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={handleBackToCatalog} className="mb-8 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                    &larr; Regresar al catalogo
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Product Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full rounded-xl object-cover mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h2>
                        <p className="text-2xl text-indigo-600 my-2">${selectedProduct.price.toFixed(2)}</p>
                    </div>
                    {/* Try-On Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">¡Pruébalo!</h3>
                        <div className="mb-4">
                            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">1. Sube una foto de ti mismo</label>
                            <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                        {userImageFile && (
                             <div className="my-4">
                               <p className="text-sm font-medium text-gray-700 mb-2">Tu foto:</p>
                               <img src={URL.createObjectURL(userImageFile)} alt="User upload preview" className="rounded-xl w-full max-w-sm mx-auto" />
                            </div>
                        )}
                        <button onClick={generateTryOnImage} disabled={!userImageFile || isLoading} className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-lg">
                            {isLoading ? 'Generating...' : '2. Generate Virtual Try-On'}
                        </button>
                        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                        <div className="mt-6 w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed">
                            {isLoading ? <Spinner /> : generatedImage ? <img src={generatedImage} alt="Virtual try-on result" className="rounded-xl object-contain max-w-full max-h-full" /> : <p className="text-gray-500 text-center p-4">Your result will appear here</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
