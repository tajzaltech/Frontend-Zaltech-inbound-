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

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="group card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-transparent hover:border-t-red-600 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(service.id);
                                                setFormData({ name: service.name, description: service.description });
                                                setIsAdding(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="p-1.5 bg-white text-gray-400 hover:text-blue-600 shadow-sm rounded-lg border border-gray-100"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this service?')) {
                                                    deleteMutation.mutate(service.id);
                                                }
                                            }}
                                            className="p-1.5 bg-white text-gray-400 hover:text-red-600 shadow-sm rounded-lg border border-gray-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Package className="w-6 h-6 text-red-600" />
                                    </div>

                                    {editingId === service.id ? (
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{service.name} (Editing...)</h4>
                                    ) : (
                                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{service.name}</h4>
                                    )}

                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 min-h-[60px]">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${service.active
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-gray-50 text-gray-600'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        {service.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="text-xs font-mono text-gray-400">#{service.id.split('-')[1]}</span>
                                </div>
                            </div>
                        ))}

                        {/* Empty State / Add New Placeholder */}
                        <div
                            onClick={() => setIsAdding(true)}
                            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group min-h-[200px]"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-red-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-red-700">Add New Service</h4>
                            <p className="text-xs text-gray-500 mt-1">Create a new service offering</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
