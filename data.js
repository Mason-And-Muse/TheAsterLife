/*
 * data.js — the decision tree content (final set, June 2026).
 *
 * Source: "Final Set" experience list. Card images aren't set yet, so cards
 * fall back to gradient placeholders (no `image` field).
 *
 * app.js consumes only the exported `TREE`. To edit content, edit CONTENT
 * below (en/em dashes are written as hyphens per the project style rule).
 */
(function () {
  'use strict';

  var CONTENT = [
    {
      category: 'Go Fast',
      subs: [
        {
          name: 'Track',
          cards: [
            { title: 'Skip Barber Racing School', desc: 'GT or formula racing school in provided race cars.', loc: 'CT, NJ, TX, CA, GA, FL, VA', url: 'https://www.skipbarber.com/programs/' },
            { title: 'NASCAR Racing Experience', desc: 'Drive a NASCAR stock car solo with a radio spotter at speedways nationwide.', loc: 'Multiple US', url: 'https://nascarracingexperience.com/' },
            { title: 'Exotics Racing', desc: 'Choose from 40+ supercars with 1-on-1 coaching on a dedicated track.', loc: 'NV', url: 'https://exoticsracing.com/las-vegas-supercar-driving-experience/' },
            { title: 'MSF Basic RiderCourse', desc: 'Structured intro motorcycle course with bikes and helmets provided.', loc: 'Multiple US', url: 'https://msf-usa.org/start-your-ride/basic-ridercourse' }
          ]
        },
        {
          name: 'Dirt',
          cards: [
            { title: 'DirtFish Rally School', desc: 'Loose-surface rally driving in school-provided cars over 1-3 days.', loc: 'WA', url: 'https://drive.dirtfish.com/drive/drive-now/' },
            { title: 'NORA - 2-Day Off-Road Boot Camp', desc: 'Two-day off-road course including vehicle recovery and a night drive.', loc: 'NY', url: 'https://nyoffroaddriving.com/two-day-off-road-boot-camp/' },
            { title: 'Ford Bronco Off-Roadeo', desc: 'Expert-guided off-road half-day session in a provided Bronco.', loc: 'NV, UT', url: 'https://broncodrives.com/' }
          ]
        },
        {
          name: 'Kart',
          cards: [
            { title: 'K1 Speed', desc: 'Indoor electric arrive-and-drive karting with timed sessions & "Glo-Karting".', loc: 'Multiple US', url: 'https://www.k1speed.com' },
            { title: 'K1 Circuit', desc: 'Higher-performance outdoor gas sprint karts with timed races.', loc: 'Multiple US', url: 'https://www.k1circuit.com' }
          ]
        }
      ]
    },
    {
      category: 'Shoot Stuff',
      subs: [
        {
          name: 'Lethal',
          cards: [
            { title: 'SIG Sauer Academy - Handgun 101', desc: 'One-day new-shooter pistol orientation with guns and ammo included.', loc: 'NH', url: 'https://sigsaueracademy.com/courses/handgun-101-handgun-orientation' },
            { title: 'SIG Sauer Academy - PSR 101', desc: 'Three-day entry-level precision scoped-rifle course to 1,000 yards.', loc: 'NH', url: 'https://sigsaueracademy.com/courses/psr-101-precision-scoped-rifle' },
            { title: 'Orvis Sandanona', desc: 'Sporting-clays and wingshooting school at the oldest US shooting preserve.', loc: 'NY', url: 'https://www.orvis.com/sandanona-shooting-grounds.html' },
            { title: 'The Range 702', desc: 'Themed full-auto shooting experiences.', loc: 'NV', url: 'https://www.therange702.com/shooting-experiences/' }
          ]
        },
        {
          name: 'Less Lethal',
          cards: [
            { title: 'Skirmish USA', desc: 'World\'s largest paintball park (700+ acres, 50 fields).', loc: 'PA', url: 'https://www.skirmish.com/' },
            { title: 'Pev\'s Paintball - Airsoft', desc: 'Outdoor walk-on and private airsoft with rental gear.', loc: 'VA', url: 'https://www.pevs.com/airsoft-public-play' },
            { title: 'iCOMBAT', desc: 'Authentic-feel tactical laser tag with realistic equipment.', loc: 'Multiple US', url: 'https://icombatwaukesha.com/' }
          ]
        },
        {
          name: 'Primitive',
          cards: [
            { title: 'World Axe Throwing League', desc: 'Coached axe/knife throwing at affiliated venues.', loc: 'Multiple US', url: 'https://worldaxethrowingleague.com/' },
            { title: 'Bad Axe Throwing', desc: 'Largest urban axe-throwing chain with coaches.', loc: 'Multiple US', url: 'https://badaxethrowing.com/' },
            { title: 'Mounted Archers of the Potomac', desc: 'Horseback-archery club with intro clinics.', loc: 'NE', url: 'https://www.mountedarchersofthepotomac.com/mountedarchersofthepotomac/' }
          ]
        }
      ]
    },
    {
      category: 'Adventure',
      subs: [
        {
          name: 'Land',
          cards: [
            { title: 'Bear Rock Adventures', desc: 'Guided/self-drive Polaris RZR (or snowmobile) rides into "Ride the Wilds."', loc: 'NH', url: 'https://bearrockadventures.com' },
            { title: 'Moab Tour Company', desc: 'Guided you-drive RZR/KRX tours on famous trails.', loc: 'UT', url: 'https://moabtourcompany.com' },
            { title: 'Appalachian Trail Adventures', desc: 'Guided wild-cave day adventures.', loc: 'VT', url: 'https://appalachiantrailadventures.com/guided-day-caving-adventures' },
            { title: 'Adirondack Extreme', desc: 'Aerial adventure park with a zipline-only tour option.', loc: 'NY', url: 'https://adirondackextreme.com' }
          ]
        },
        {
          name: 'Air',
          cards: [
            { title: 'Fighter Combat International', desc: 'Hands-on aerobatics in an Extra 300L with an instructor.', loc: 'NV', url: 'https://fightercombat.com' },
            { title: 'Sky Combat Ace', desc: 'Aerobatic Extra 330 ride where you take the controls.', loc: 'NV', url: 'https://skycombatace.com' },
            { title: 'Nutmeg Soaring Association', desc: 'Glider intro demo rides with hands-on time at a club.', loc: 'CT', url: 'https://nutmegsoaring.org' }
          ]
        },
        {
          name: 'Water',
          cards: [
            { title: 'Hudson River Jet Ski', desc: 'One-hour guided Hudson jet-ski tour with safety training.', loc: 'NJ', url: 'https://hudsonriverjetski.com' },
            { title: 'Offshore Rockets (Incredible Adventures)', desc: 'Learn to drive an offshore powerboat in Miami.', loc: 'FL', url: 'https://incredible-adventures.com/offshore_rockets.html' },
            { title: 'New England Outdoor Center', desc: 'Penobscot Class III-IV intro raft trip with a riverside cookout.', loc: 'ME', url: 'https://neoc.com/white-water-rafting-in-maine' }
          ]
        }
      ]
    },
    {
      category: 'Experience',
      subs: [
        {
          name: 'Challenge',
          cards: [
            { title: 'The Escape Game', desc: 'High-production multi-room escape games.', loc: 'Multiple US', url: 'https://theescapegame.com' },
            { title: 'Escaparium', desc: 'World renowned escape rooms.', loc: 'Montreal', url: 'https://www.escaparium.ca/laval' },
            { title: 'Activate', desc: 'High-tech interactive challenge rooms with scoring.', loc: 'Multiple US', url: 'https://playactivate.com' },
            { title: 'Boda Borg Boston', desc: '"Questing" with 24 physical/mental challenge rooms.', loc: 'MA', url: 'https://www.bodaborg.com/boston' }
          ]
        },
        {
          name: 'Virtual',
          cards: [
            { title: 'iFLY Indoor Skydiving', desc: 'Free-fall sensation in a ground-level vertical wind tunnel (no jumping).', loc: 'Multiple US', url: 'https://www.iflyworld.com' },
            { title: 'Zero Latency', desc: 'Warehouse-scale free-roam co-op VR for up to 8 players.', loc: 'Multiple US', url: 'https://zerolatencyvr.com/en/experiences' },
            { title: 'Sandbox VR', desc: 'Full-body motion-capture VR adventures for small groups.', loc: 'Multiple US', url: 'https://sandboxvr.com' }
          ]
        },
        {
          name: 'Art',
          cards: [
            { title: 'UrbanGlass - Glassblowing 101', desc: 'Two-day workshop - learn the introductory skills of glassblowing.', loc: 'NY', url: 'https://urbanglass.org/classes/detail/glassblowing-101-june' },
            { title: 'Peters Valley - Intro to Bladesmithing', desc: 'Forge a blade (or something else!) at a renowned craft school. Tons of different options.', loc: 'NJ', url: 'https://petersvalley.org/' },
            { title: 'Meow Wolf', desc: 'Sprawling surreal walk-through art installations with hidden, nonlinear stories.', loc: 'Multiple US', url: 'https://meowwolf.com/visit' }
          ]
        }
      ]
    }
  ];

  // Build the tree, assigning stable ids (cards keep a global index so each
  // gets a stable gradient placeholder).
  var cardNo = 0;
  var branches = CONTENT.map(function (cat, ci) {
    var bId = 'b' + (ci + 1);
    return {
      id: bId,
      label: cat.category,
      subcategories: cat.subs.map(function (sub, si) {
        return {
          id: bId + 's' + (si + 1),
          label: sub.name,
          cards: sub.cards.map(function (card) {
            return {
              id: 'c' + (cardNo++),
              name: card.title,
              blurb: card.desc,
              location: card.loc,
              url: card.url
              // image: '...'  - add when screenshots arrive
            };
          })
        };
      })
    };
  });

  window.TREE = { branches: branches };
})();
