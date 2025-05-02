'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Shield, 
  ArrowLeft, 
  Search, 
  Plus, 
  Save, 
  Trash2,
  Zap,
  Heart,
  Star,
  DollarSign,
  Users,
  Target,
  Map,
  Building2
} from 'lucide-react';
import Link from 'next/link';

interface Character {
  id: string;
  user_id: string;
  name: string;
  level: number;
  experience: number;
  money: number;
  energy: number;
  nerve: number;
  health: number;
  max_health: number;
  stamina: number;
  max_stamina: number;
  street_cred: number;
  heat_level: number;
  family_honor: number;
  public_image: number;
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  endurance: number;
  luck: number;
  inventory: any[];
  equipment: any;
  territories: string[];
}

export default function CharacterManagementPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast.error('Failed to fetch characters');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (character: Character) => {
    setSelectedCharacter(character);
    setEditingCharacter({ ...character });
  };

  const handleSave = async () => {
    if (!editingCharacter) return;

    try {
      const { error } = await supabase
        .from('characters')
        .update(editingCharacter)
        .eq('id', editingCharacter.id);

      if (error) throw error;

      toast.success('Character updated successfully');
      setSelectedCharacter(null);
      setEditingCharacter(null);
      fetchCharacters();
    } catch (error) {
      console.error('Error updating character:', error);
      toast.error('Failed to update character');
    }
  };

  const handleDelete = async (characterId: string) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId);

      if (error) throw error;

      toast.success('Character deleted successfully');
      fetchCharacters();
    } catch (error) {
      console.error('Error deleting character:', error);
      toast.error('Failed to delete character');
    }
  };

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Character Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 bg-gray-900 border-gray-800"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredCharacters.map((character) => (
            <Card key={character.id} className="p-6 bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{character.name}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(character)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(character.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Level {character.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span>${character.money.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span>{character.energy}/{character.max_stamina}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{character.health}/{character.max_health}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Strength: {character.strength}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>Agility: {character.agility}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-500" />
                  <span>Charisma: {character.charisma}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-green-500" />
                  <span>Territories: {character.territories?.length || 0}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedCharacter && editingCharacter && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-6 bg-gray-900">
              <h2 className="text-2xl font-bold mb-6">Edit Character</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  <Input
                    type="number"
                    value={editingCharacter.level}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      level: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Money</label>
                  <Input
                    type="number"
                    value={editingCharacter.money}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      money: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Energy</label>
                  <Input
                    type="number"
                    value={editingCharacter.energy}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      energy: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Health</label>
                  <Input
                    type="number"
                    value={editingCharacter.health}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      health: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Strength</label>
                  <Input
                    type="number"
                    value={editingCharacter.strength}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      strength: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Agility</label>
                  <Input
                    type="number"
                    value={editingCharacter.agility}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      agility: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Intelligence</label>
                  <Input
                    type="number"
                    value={editingCharacter.intelligence}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      intelligence: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Charisma</label>
                  <Input
                    type="number"
                    value={editingCharacter.charisma}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      charisma: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Endurance</label>
                  <Input
                    type="number"
                    value={editingCharacter.endurance}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      endurance: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Luck</label>
                  <Input
                    type="number"
                    value={editingCharacter.luck}
                    onChange={(e) => setEditingCharacter({
                      ...editingCharacter,
                      luck: parseInt(e.target.value)
                    })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCharacter(null);
                    setEditingCharacter(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 