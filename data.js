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
      category: 'Drive Fast',
      subs: [
        {
          name: 'Track',
          cards: [
            { title: 'Skip Barber Racing School', desc: 'GT or formula racing school. Are you kidding me?', loc: 'CT, NJ, TX, CA, GA, FL, VA', url: 'https://www.skipbarber.com/programs/', img: 'photos/drive-fast/skip-barber.png' },
            { title: 'NASCAR Racing Experience', desc: 'Drive a NASCAR stock car solo? WTH?!', loc: 'Multiple US', url: 'https://nascarracingexperience.com/', img: 'photos/drive-fast/nascar.jpeg' },
            { title: 'Exotics Racing', desc: 'Choose from 40+ supercars with 1-on-1 coaching. No way.', loc: 'NV', url: 'https://exoticsracing.com/las-vegas-supercar-driving-experience/', img: 'photos/drive-fast/exotics-racing.jpg' },
            { title: 'MSF Basic RiderCourse', desc: 'Structured intro motorcycle course. Don\'t tell mom.' , loc: 'Multiple US', url: 'https://msf-usa.org/start-your-ride/basic-ridercourse', img: 'photos/drive-fast/msf.jpg' }
          ]
        },
        {
          name: 'Dirt',
          cards: [
            { title: 'DirtFish Rally School', desc: 'Loose-surface crap-your-pants rally driving over 1-3 days.', loc: 'WA', url: 'https://drive.dirtfish.com/drive/drive-now/', img: 'photos/drive-fast/dirt-fish.jpg' },
            { title: 'NORA - 2-Day Off-Road Boot Camp', desc: 'Two-day off-road course with vehicle recovery and a night drive. Madness!', loc: 'NY', url: 'https://nyoffroaddriving.com/two-day-off-road-boot-camp/', img: 'photos/drive-fast/nora.jpg' },
            { title: 'Ford Bronco Off-Roadeo', desc: 'Expert-guided off-road half-day session in a provided Bronco. In Moab!?', loc: 'NV, UT', url: 'https://broncodrives.com/', img: 'photos/drive-fast/bronco.webp' }
          ]
        },
        {
          name: 'Kart',
          cards: [
            { title: 'K1 Speed', desc: 'Indoor electric karting (sharting?!) with timed sessions & "Glo-Karting".', loc: 'Multiple US', url: 'https://www.k1speed.com', img: 'photos/drive-fast/k1-speed.jpeg' },
            { title: 'K1 Circuit', desc: 'Higher-performance outdoor gas sprint karts. Fuuuuuuck!', loc: 'Multiple US', url: 'https://www.k1circuit.com', img: 'photos/drive-fast/k1-circuit.jpeg' }
          ]
        }
      ]
    },
    {
      category: 'Shoot Shit',
      subs: [
        {
          name: 'Lethal',
          cards: [
            { title: 'SIG Sauer Academy - Handgun 101', desc: 'One-day new-shooter pistol orientation. Hands up!', loc: 'NH', url: 'https://sigsaueracademy.com/courses/handgun-101-handgun-orientation', img: 'photos/shoot-shit/sig-handgun.webp' },
            { title: 'SIG Sauer Academy - PSR 101', desc: 'Three-day entry-level precision scoped-rifle course. Ghillie monster?!', loc: 'NH', url: 'https://sigsaueracademy.com/courses/psr-101-precision-scoped-rifle', img: 'photos/shoot-shit/sig-rifle.webp' },
            { title: 'Orvis Sandanona', desc: 'Sporting-clays and wingshooting school at the oldest US shooting preserve. Where\s my bourbon?', loc: 'NY', url: 'https://www.orvis.com/sandanona-shooting-grounds.html', img: 'photos/shoot-shit/orvis.jpg' },
            { title: 'The Range 702', desc: 'Themed full-auto shooting experiences. Full Rambo style.', loc: 'NV', url: 'https://www.therange702.com/shooting-experiences/', img: 'photos/shoot-shit/702.jpg' }
          ]
        },
        {
          name: 'Mostly Harmless',
          cards: [
            { title: 'Skirmish USA', desc: 'World\'s largest paintball park and whitewater. Battles & paddles?!', loc: 'PA', url: 'https://www.skirmish.com/', img: 'photos/shoot-shit/skirmish.jpg' },
            { title: 'Pev\'s Paintball - Airsoft', desc: 'Outdoor walk-on and private airsoft with rental gear. So relaxing.', loc: 'VA', url: 'https://www.pevs.com/airsoft-public-play', img: 'photos/shoot-shit/pev.webp' },
            { title: 'iCOMBAT', desc: 'Tactical laser tag with realistic equipment. Now you\'re talking.', loc: 'Multiple US', url: 'https://icombatwaukesha.com/', img: 'photos/shoot-shit/icombat.jpeg' }
          ]
        },
        {
          name: 'Primitive',
          cards: [
            { title: 'World Axe Throwing League', desc: 'Coached axe/knife throwing. Stand back!', loc: 'Multiple US', url: 'https://worldaxethrowingleague.com/', img: 'photos/shoot-shit/worldaxe.jpg' },
            { title: 'Bad Axe Throwing', desc: 'Urban axe-throwing with coaches. Badaxe indeed.', loc: 'Multiple US', url: 'https://badaxethrowing.com/', img: 'photos/shoot-shit/badaxe.jpg' },
            { title: 'Mounted Archers of the Potomac', desc: 'Horseback-archery club with intro clinics. Mongol much?', loc: 'NE', url: 'https://www.mountedarchersofthepotomac.com/mountedarchersofthepotomac/', img: 'photos/shoot-shit/horsearchery.jpeg' }
          ]
        }
      ]
    },
    {
      category: 'Don\'t Die',
      subs: [
        {
          name: 'Land',
          cards: [
            { title: 'Bear Rock Adventures', desc: 'Self-drive RZR or snowmobile rides. Guided or not. "Ride the Wilds."', loc: 'NH', url: 'https://bearrockadventures.com', img: 'photos/dont-die/bearrock.jpg' },
            { title: 'Moab Tour Company', desc: 'Guided you-drive RZR/KRX tours on famous trails. IT\'S MOAB', loc: 'UT', url: 'https://moabtourcompany.com', img: 'photos/dont-die/moab.jpg' },
            { title: 'Appalachian Trail Adventures', desc: 'Guided wild-cave day adventures. Spelunk this.', loc: 'VT', url: 'https://appalachiantrailadventures.com/guided-day-caving-adventures', img: 'photos/dont-die/appalaciantrail.jpg' },
            { title: 'Adirondack Extreme', desc: 'Aerial adventure park with a zipline-only tour option. Don\'t look down', loc: 'NY', url: 'https://adirondackextreme.com', img: 'photos/dont-die/adirondackextreme.jpg' }
          ]
        },
        {
          name: 'Air',
          cards: [
            { title: 'Fighter Combat International', desc: 'Aerobatics in an Extra 300L with an instructor. Combat mission options?!', loc: 'NV', url: 'https://fightercombat.com', img: 'photos/dont-die/fightercombat.jpg' },
            { title: 'Sky Combat Ace', desc: 'Aerobatic Extra 330. You take the controls. Bring a vomit bag.', loc: 'NV', url: 'https://skycombatace.com', img: 'photos/dont-die/skycombatace.jpg' },
            { title: 'Nutmeg Soaring Association', desc: 'Glider intro demo rides. Zen out.', loc: 'CT', url: 'https://nutmegsoaring.org', img: 'photos/dont-die/nutmeg.jpg' }
          ]
        },
        {
          name: 'Water',
          cards: [
            { title: 'Hudson River Jet Ski', desc: 'One-hour guided Hudson jet-ski tour. So civilized, so not.', loc: 'NJ', url: 'https://hudsonriverjetski.com', img: 'photos/dont-die/hudson.jpg' },
            { title: 'Offshore Rockets (Incredible Adventures)', desc: 'Learn to drive an offshore powerboat in Miami. Drugs not included.', loc: 'FL', url: 'https://incredible-adventures.com/offshore_rockets.html', img: 'photos/dont-die/incredibleadventures.jpg' },
            { title: 'New England Outdoor Center', desc: 'Penobscot Class III-IV raft trip with a riverside cookout. Come dry, leave wet.', loc: 'ME', url: 'https://neoc.com/white-water-rafting-in-maine', img: 'photos/dont-die/neoc.jpg' }
          ]
        }
      ]
    },
    {
      category: 'A Bit Less Lethal',
      subs: [
        {
          name: 'Challenge',
          cards: [
            { title: 'The Escape Game', desc: 'High-production multi-room escape games. Engage the brains.', loc: 'Multiple US', url: 'https://theescapegame.com', img: 'photos/less-lethal/escapegame.jpg' },
            { title: 'Escaparium', desc: 'World renowned escape rooms. Seriously - top world ranked!', loc: 'Montreal', url: 'https://www.escaparium.ca/laval', img: 'photos/less-lethal/escaparium.jpg' },
            { title: 'Activate', desc: 'High-tech interactive challenge rooms with scoring. Do a bunch.', loc: 'Multiple US', url: 'https://playactivate.com', img: 'photos/less-lethal/activate.webp' },
            { title: 'Boda Borg Boston', desc: '"Questing" with 24 physical/mental challenge rooms. Stay for hours.', loc: 'MA', url: 'https://www.bodaborg.com/boston', img: 'photos/less-lethal/bodaborg.webp' }
          ]
        },
        {
          name: 'Virtual',
          cards: [
            { title: 'iFLY Indoor Skydiving', desc: 'Indoor skydiving. All the diving, none of the sky. ', loc: 'Multiple US', url: 'https://www.iflyworld.com', img: 'photos/less-lethal/iflyworld.webp' },
            { title: 'Zero Latency', desc: 'Warehouse-scale free-roam co-op VR for up to 8 players. OMG yes.', loc: 'Multiple US', url: 'https://zerolatencyvr.com/en/experiences', img: 'photos/less-lethal/zerolatency.jpg' },
            { title: 'Sandbox VR', desc: 'Full-body motion-capture VR adventures for small groups. Again, OMG please yes.', loc: 'Multiple US', url: 'https://sandboxvr.com', img: 'photos/less-lethal/sandboxvr.jpg' }
          ]
        },
        {
          name: 'Art',
          cards: [
            { title: 'UrbanGlass - Glassblowing 101', desc: 'Two-day workshop intro to glassblowing. Other cool classes. So cool, yet hot!', loc: 'NY', url: 'https://urbanglass.org/classes/detail/glassblowing-101-june', img: 'photos/less-lethal/urbanglass.jpg' },
            { title: 'Peters Valley - Intro to Bladesmithing', desc: 'Forge a blade at a renowned craft school. Tons of different other options. Not just sharp things!', loc: 'NJ', url: 'https://petersvalley.org/', img: 'photos/less-lethal/petersvalley.jpg' },
            { title: 'Meow Wolf', desc: 'Sprawling surreal walk-through art installations with hidden, nonlinear stories. Epilepsy warning.', loc: 'Multiple US', url: 'https://meowwolf.com/visit', img: 'photos/less-lethal/meowwolf.jpg' }
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
              url: card.url,
              image: card.img        // undefined -> gradient placeholder
            };
          })
        };
      })
    };
  });

  window.TREE = { branches: branches };
})();
