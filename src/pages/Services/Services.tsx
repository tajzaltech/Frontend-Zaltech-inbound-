import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { servicesApi } from '../../api/services';
import { Header } from '../../components/layout/Header';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useState } from 'react';
import type { Service } from '../../types/service';

export function Services() {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const queryClient = useQueryClient();

    const { data: services = [], isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: servicesApi.getServices,
    });

    const createMutation = useMutation({
        mutationFn: servicesApi.createService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setIsAdding(false);
            setFormData({ name: '', description: '' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
            servicesApi.updateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setEditingId(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: servicesApi.deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData });
        } else {
            createMutation.mutate({ ...formData, active: true });
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 h-full">
                <Header title="Services" />
                <div className="p-8">
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
            <Header
                title="Services"
                actions={
                    <button
                        onClick={() => setIsAdding(true)}
                        className="btn-primary flex items-center gap-2 shadow-lg shadow-red-900/10"
                    >
                        <Plus className="w-4 h-4" />
                        Add Service
                    </button>
                }
            />

            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    {isAdding && (
                        <div className="card mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">New Service</h3>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="sr-only">Close</span>
                                    <Plus className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field w-full"
                                        placeholder="e.g. AI Workflow Automation"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field w-full min-h-[100px]"
                                        placeholder="Describe what this service offers..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="btn-primary">
                                        Create Service
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAdding(false);
                                            setFormData({ name: '', description: '' });
                                        }}
                                        className="btn-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid gap-4">
                        {services.map((service) => (
                            <div key={service.id} className="card hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 mt-1">
                                            <Package className="w-5 h-5 text-gray-400" />
                                        </div>

                                        <div>
                                            {editingId === service.id ? (
                                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{service.name} (Editing...)</h4>
                                            ) : (
                                                <>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h4>
                                                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{service.description}</p>
                                                </>
                                            )}

                                            <div className="mt-3 flex items-center gap-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${service.active
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : 'bg-gray-50 text-gray-600 border-gray-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                    {service.active ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-xs text-gray-400">ID: {service.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(service.id);
                                                setFormData({ name: service.name, description: service.description });
                                                setIsAdding(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                            title="Edit Service"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this service?')) {
                                                    deleteMutation.mutate(service.id);
                                                }
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Service"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
