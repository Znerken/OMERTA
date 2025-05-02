export type CharacterOrigin = 'little_italy' | 'the_docks' | 'downtown' | 'the_outskirts';
export type CharacterClass = 'enforcer' | 'consigliere' | 'racketeer' | 'shadow' | 'street_boss';
export type CharacterTrait = 'connected' | 'street_smart' | 'old_money' | 'quick_learner' | 'iron_will' | 'silver_tongue';

export interface Character {
    id: string;
    user_id: string;
    name: string;
    origin: CharacterOrigin;
    class: CharacterClass;
    
    // Core Stats
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
    endurance: number;
    luck: number;
    
    // Game Stats
    level: number;
    experience: number;
    energy: number;
    nerve: number;
    health: number;
    max_health: number;
    stamina: number;
    max_stamina: number;
    
    // Special Traits
    traits: CharacterTrait[];
    
    // Reputation
    street_cred: number;
    heat_level: number;
    family_honor: number;
    public_image: number;
    
    money: number;
    
    created_at: string;
    updated_at: string;
}

export interface CharacterCreation {
    name: string;
    origin: CharacterOrigin;
    class: CharacterClass;
    traits: CharacterTrait[];
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
    endurance: number;
    luck: number;
}

export interface CharacterStats {
    current: number;
    base: number;
    modifier: number;
}

// Character creation step types
export type CharacterCreationStep = 'origin' | 'class' | 'traits' | 'stats' | 'name' | 'preview';

// Origin descriptions and bonuses
export const ORIGIN_INFO = {
    little_italy: {
        name: 'Little Italy',
        description: 'Traditional mafia stronghold. Strong family ties and connections.',
        bonuses: ['Family reputation +20%', 'Connection-based skill effectiveness +15%']
    },
    the_docks: {
        name: 'The Docks',
        description: 'Hub of illegal trade. Perfect for smuggling operations.',
        bonuses: ['Illegal goods prices -15%', 'Smuggling success rate +20%']
    },
    downtown: {
        name: 'Downtown',
        description: 'Business district. Opportunities in both legal and illegal ventures.',
        bonuses: ['Business income +25%', 'Money laundering efficiency +15%']
    },
    the_outskirts: {
        name: 'The Outskirts',
        description: 'Rough neighborhood. Survival of the fittest.',
        bonuses: ['Stealth success rate +20%', 'Territory control cost -15%']
    }
} as const;

// Class descriptions and specialties
export const CLASS_INFO = {
    enforcer: {
        name: 'Enforcer',
        description: 'Muscle of the family. Specialized in combat and intimidation.',
        specialties: ['Combat effectiveness +25%', 'Intimidation success rate +20%']
    },
    consigliere: {
        name: 'Consigliere',
        description: 'Strategic advisor. Master of negotiations and planning.',
        specialties: ['Negotiation success rate +25%', 'Territory income +20%']
    },
    racketeer: {
        name: 'Racketeer',
        description: 'Business specialist. Expert in running illegal operations.',
        specialties: ['Business management +25%', 'Income from rackets +20%']
    },
    shadow: {
        name: 'Shadow',
        description: 'Stealth specialist. Excels in covert operations.',
        specialties: ['Stealth operations +25%', 'Detection avoidance +20%']
    },
    street_boss: {
        name: 'Street Boss',
        description: 'Territory leader. Commands respect and loyalty.',
        specialties: ['Territory control +25%', 'Crew effectiveness +20%']
    }
} as const;

// Trait descriptions and effects
export const TRAIT_INFO = {
    connected: {
        name: 'Connected',
        description: 'Well-connected in the criminal underworld.',
        effect: 'Better relationships with NPCs, unlock special dialogue options'
    },
    street_smart: {
        name: 'Street Smart',
        description: 'Know the ins and outs of street crime.',
        effect: 'Enhanced income from street-level crimes, better escape chances'
    },
    old_money: {
        name: 'Old Money',
        description: 'Come from a wealthy background.',
        effect: 'Start with additional resources, better business connections'
    },
    quick_learner: {
        name: 'Quick Learner',
        description: 'Pick up new skills faster than others.',
        effect: 'Faster XP gain, reduced training costs'
    },
    iron_will: {
        name: 'Iron Will',
        description: 'Exceptionally resistant to pressure.',
        effect: 'Better resistance to interrogation, reduced stress from activities'
    },
    silver_tongue: {
        name: 'Silver Tongue',
        description: 'Natural negotiator and smooth talker.',
        effect: 'Better success rate in negotiations, reduced bribe costs'
    }
} as const;