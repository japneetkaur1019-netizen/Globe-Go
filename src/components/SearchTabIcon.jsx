import { Building2, Home, Plane, Car, Package, Ticket, Ship } from 'lucide-react';

// JSON stores icon names; React component references stay in this renderer.
const ICONS = { Building2, HomeIcon: Home, Plane, Car, Package, Ticket, Ship };

export default function SearchTabIcon({ name }) {
  const Icon = ICONS[name];
  return Icon ? <Icon size={20} /> : null;
}
