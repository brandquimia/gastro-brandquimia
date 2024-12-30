import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService } from '../../services/businessService';
import { Business, BusinessHours } from '../../types/user';
import { airtableService, GoogleReview } from '../../services/airtableService';
import { ReviewsList } from '../../components/business/ReviewsList';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const FEATURES = [
  'wifi',
  'parking',
  'outdoor-seating',
  'delivery',
  'takeaway',
  'wheelchair-accessible',
  'reservations',
  'credit-cards',
  'live-music',
  'air-conditioning'
] as const;

const CUISINE_TYPES = [
  'italiana',
  'mexicana',
  'japonesa',
  'china',
  'española',
  'americana',
  'mediterránea',
  'india',
  'francesa',
  'fusión',
  'vegana',
  'otra'
] as const;

const DEFAULT_HOURS = {
  monday: { open: '', close: '' },
  tuesday: { open: '', close: '' },
  wednesday: { open: '', close: '' },
  thursday: { open: '', close: '' },
  friday: { open: '', close: '' },
  saturday: { open: '', close: '' },
  sunday: { open: '', close: '' }
};

export default function BusinessEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Partial<Business>>({
    name: '',
    description: '',
    type: 'restaurant',
    cuisine: [],
    priceRange: '€€',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    contact: {
      phone: '',
      email: '',
      whatsapp: ''
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      website: ''
    },
    businessHours: DEFAULT_HOURS,
    features: [],
    status: 'active'
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (id) {
      loadBusiness();
      loadReviews();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadBusiness = async () => {
    try {
      const data = await businessService.getBusinessById(id!);
      if (data) {
        setBusiness({
          ...business,
          ...data,
          businessHours: {
            ...DEFAULT_HOURS,
            ...data.businessHours
          },
          contact: {
            ...data.contact,
            phone: data.contact?.phone || '',
            email: data.contact?.email || '',
            whatsapp: data.contact?.whatsapp || ''
          },
          socialMedia: {
            ...data.socialMedia,
            instagram: data.socialMedia?.instagram || '',
            facebook: data.socialMedia?.facebook || '',
            twitter: data.socialMedia?.twitter || '',
            website: data.socialMedia?.website || ''
          }
        });
      }
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    setLoadingReviews(true);
    try {
      const data = await airtableService.getReviewsByBusinessId(id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (id) {
        await businessService.updateBusiness(id, business);
      } else {
        const newBusiness = {
          ...business,
          name: business.name || '',
          description: business.description || '',
          type: business.type || 'restaurant',
          cuisine: business.cuisine || [],
          priceRange: business.priceRange || '€€',
          location: business.location || { address: '', city: '', state: '', country: '', postalCode: '' },
          contact: business.contact || { phone: '', email: '' },
          socialMedia: business.socialMedia || {},
          businessHours: business.businessHours || {},
          features: business.features || [],
          status: business.status || 'active'
        } as Business;
        
        await businessService.createBusiness(newBusiness);
      }
      navigate('/businesses');
    } catch (error) {
      console.error('Error saving business:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setBusiness(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHoursChange = (day: keyof BusinessHours, field: 'open' | 'close', value: string) => {
    const newHours = { ...business.businessHours } as BusinessHours;
    newHours[day] = {
      open: field === 'open' ? value : (newHours[day]?.open || ''),
      close: field === 'close' ? value : (newHours[day]?.close || '')
    };
    updateField('businessHours', newHours);
  };

  if (loading) return <div className="flex justify-center p-8">Cargando...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {id ? 'Editar Negocio' : 'Nuevo Negocio'}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="mb-6 border-b">
        <nav className="flex gap-4">
          {['basic', 'location', 'contact', 'hours', 'features', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <form className="space-y-6">
        {/* Información Básica */}
        {activeTab === 'basic' && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={business.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="restaurant">Restaurante</option>
                  <option value="bar">Bar</option>
                  <option value="cafe">Café</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={business.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Cocina</label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {CUISINE_TYPES.map((cuisine) => (
                  <label key={cuisine} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={business.cuisine?.includes(cuisine)}
                      onChange={(e) => {
                        const newCuisine = e.target.checked
                          ? [...(business.cuisine || []), cuisine]
                          : (business.cuisine || []).filter(c => c !== cuisine);
                        updateField('cuisine', newCuisine);
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rango de Precios</label>
              <select
                value={business.priceRange}
                onChange={(e) => updateField('priceRange', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="€">€ (Económico)</option>
                <option value="€€">€€ (Moderado)</option>
                <option value="€€€">€€€ (Caro)</option>
                <option value="€€€€">€€€€ (Lujo)</option>
              </select>
            </div>
          </section>
        )}

        {/* Ubicación */}
        {activeTab === 'location' && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  value={business.location?.address}
                  onChange={(e) => updateField('location', { ...business.location, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <input
                  type="text"
                  value={business.location?.city}
                  onChange={(e) => updateField('location', { ...business.location, city: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Provincia</label>
                <input
                  type="text"
                  value={business.location?.state}
                  onChange={(e) => updateField('location', { ...business.location, state: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">País</label>
                <input
                  type="text"
                  value={business.location?.country}
                  onChange={(e) => updateField('location', { ...business.location, country: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                <input
                  type="text"
                  value={business.location?.postalCode}
                  onChange={(e) => updateField('location', { ...business.location, postalCode: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* Contacto */}
        {activeTab === 'contact' && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  value={business.contact?.phone}
                  onChange={(e) => updateField('contact', { ...business.contact, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                <input
                  type="tel"
                  value={business.contact?.whatsapp}
                  onChange={(e) => updateField('contact', { ...business.contact, whatsapp: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={business.contact?.email}
                  onChange={(e) => updateField('contact', { ...business.contact, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Redes Sociales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="text"
                    value={business.socialMedia?.instagram}
                    onChange={(e) => updateField('socialMedia', { ...business.socialMedia, instagram: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="text"
                    value={business.socialMedia?.facebook}
                    onChange={(e) => updateField('socialMedia', { ...business.socialMedia, facebook: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    type="text"
                    value={business.socialMedia?.twitter}
                    onChange={(e) => updateField('socialMedia', { ...business.socialMedia, twitter: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sitio Web</label>
                  <input
                    type="url"
                    value={business.socialMedia?.website}
                    onChange={(e) => updateField('socialMedia', { ...business.socialMedia, website: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Horarios */}
        {activeTab === 'hours' && (
          <section className="space-y-4">
            {DAYS.map((day) => (
              <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="font-medium capitalize">{day}</div>
                <div className="flex gap-2 items-center">
                  <input
                    type="time"
                    value={business.businessHours?.[day]?.open || ''}
                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span>a</span>
                  <input
                    type="time"
                    value={business.businessHours?.[day]?.close || ''}
                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={!!business.businessHours?.[day]}
                      onChange={(e) => {
                        const newHours = { ...business.businessHours };
                        newHours[day] = e.target.checked
                          ? { open: '09:00', close: '18:00' }
                          : null;
                        updateField('businessHours', newHours);
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">Abierto</span>
                  </label>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Características */}
        {activeTab === 'features' && (
          <section className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {FEATURES.map((feature) => (
                <label key={feature} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={business.features?.includes(feature)}
                    onChange={(e) => {
                      const newFeatures = e.target.checked
                        ? [...(business.features || []), feature]
                        : (business.features || []).filter(f => f !== feature);
                      updateField('features', newFeatures);
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">{feature.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section>
            <ReviewsList reviews={reviews} isLoading={loadingReviews} />
          </section>
        )}
      </form>
    </div>
  );
} 