import os
import sys
from datetime import datetime, timezone

# Add backend root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database.connection import SessionLocal, init_db
from app.models.user import User
from app.models.lecture import Lecture, LectureStatus, SourceType
from app.models.transcript import Transcript
from app.models.summary import Summary
from app.models.key_point import KeyPoint
from app.models.revision_note import RevisionNote
from app.models.quiz import Quiz, Question, QuizAttempt
from app.models.note import Note
from app.core.security import get_password_hash

def seed_database():
    print("Initializing database tables...")
    init_db()
    db = SessionLocal()

    try:
        # 1. Create Default Student User
        user = db.query(User).filter(User.email == "student@noteflow.ai").first()
        if not user:
            print("Creating default demo student user (student@noteflow.ai)...")
            user = User(
                name="Alex Vance",
                email="student@noteflow.ai",
                password_hash=get_password_hash("noteflow123")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            print("Demo student user already exists.")

        # Check if lectures already exist
        existing_lectures = db.query(Lecture).filter(Lecture.user_id == user.id).count()
        if existing_lectures > 0:
            print(f"Database already contains {existing_lectures} lectures. Skipping seed.")
            return

        print("Seeding rich multi-disciplinary sample lectures...")

        # ----------------------------------------------------
        # LECTURE 1: Computer Science - Distributed Consensus & Raft
        # ----------------------------------------------------
        lec1 = Lecture(
            user_id=user.id,
            title="Consensus in Distributed Systems & The Raft Protocol",
            subject="Computer Science",
            source_type=SourceType.AUDIO_UPLOAD.value,
            duration=3120,
            status=LectureStatus.COMPLETED.value
        )
        db.add(lec1)
        db.flush()

        trans1 = (
            "Good morning class. Today we delve into one of the most critical topics in distributed systems: "
            "Consensus and the Raft Algorithm. Replicated state machines are the foundation for fault-tolerant "
            "services like etcd, Apache ZooKeeper, and Spanner. If you want a cluster of machines to agree on a state machine "
            "transition even when network partitions or server crashes occur, you must solve consensus.\n\n"
            "Historically, Paxos was the dominant protocol. However, Leslie Lamport's Paxos is famously difficult to understand "
            "and extremely hard to implement correctly in practical software. In 2014, Diego Ongaro and John Ousterhout published "
            "'In Search of an Understandable Consensus Algorithm', introducing Raft. Raft achieves the exact same safety guarantees "
            "and performance as Multi-Paxos, but separates the consensus problem into three independent components:\n\n"
            "First, Leader Election. A Raft node exists in one of three states: Follower, Candidate, or Leader. Time is divided into "
            "logical Terms, numbered with consecutive integers. Leaders periodically send heartbeat AppendEntries RPCs. If a follower's "
            "randomized election timeout triggers—typically between 150ms and 300ms—it assumes the leader is dead, increments its term, "
            "transitions to Candidate, votes for itself, and broadcasts RequestVote RPCs.\n\n"
            "Second, Log Replication. When clients send commands to the Leader, the leader writes them to its log and issues "
            "AppendEntries to all followers. Once a majority (a quorum of (N/2)+1) writes the log entry, the leader commits it, applies "
            "it to its state machine, and replies to the client.\n\n"
            "Third, Safety. Raft guarantees that if a leader has committed a log entry for a given term, that entry will be present in the logs "
            "of the leaders for all higher terms. This is enforced by the election rule: a follower will deny its vote if the candidate's log "
            "is less up-to-date than its own log."
        )
        db.add(Transcript(lecture_id=lec1.id, transcript_text=trans1, language="en"))

        summary1 = (
            "### Lecture Summary: Distributed Systems & Raft Consensus\n\n"
            "This lecture covers **Consensus in Distributed Systems** with an architectural focus on the **Raft Protocol** "
            "designed by Ongaro & Ousterhout as an understandable alternative to Paxos.\n\n"
            "#### Core Takeaways:\n"
            "- **Problem Formulation:** How distributed servers agree on shared state across network partitions and crashes.\n"
            "- **State Transitions:** Nodes cycle through `Follower`, `Candidate`, and `Leader` states based on randomized election timeouts.\n"
            "- **Decomposition of Consensus:** Raft splits consensus into three distinct subproblems: **Leader Election**, **Log Replication**, and **Safety**.\n"
            "- **Quorum Majority:** Progress requires a strict quorum of `(N/2) + 1` nodes to commit state modifications.\n"
            "- **Election Safety Invariant:** Leaders must possess all previously committed entries before taking leadership."
        )
        db.add(Summary(lecture_id=lec1.id, summary_text=summary1))

        key_pts1 = [
            {"title": "Paxos vs. Raft Paradigm", "description": "Raft was engineered explicitly for understandability and modularity while matching Multi-Paxos performance.", "importance": "High"},
            {"title": "Three Server States", "description": "A node is either a Follower (passive listener), Candidate (soliciting votes), or Leader (handling writes and heartbeats).", "importance": "Critical"},
            {"title": "Logical Terms as Virtual Clocks", "description": "Terms act as logical clocks identifying obsolete leaders; any message with a stale term number is immediately rejected.", "importance": "High"},
            {"title": "Randomized Election Timeouts", "description": "Randomized timers (150ms-300ms) prevent split-vote deadlocks during concurrent leader elections.", "importance": "High"},
            {"title": "Strict Majority Quorum Rule", "description": "Commits require acknowledgment from at least (N/2) + 1 nodes, ensuring two conflicting leaders cannot commit simultaneously.", "importance": "Critical"},
            {"title": "Log Matching Safety Invariant", "description": "If two logs contain an entry with the same index and term, they are identical up to that index.", "importance": "High"}
        ]
        db.add(KeyPoint(lecture_id=lec1.id, content=key_pts1))

        rev1 = {
            "topic": "Consensus & The Raft Protocol",
            "important_concepts": [
                {"concept": "Replicated State Machine", "explanation": "A collection of identical state machines on independent nodes computing identical states via an ordered log."},
                {"concept": "Split Vote", "explanation": "A condition where multiple candidates split the votes equally and no candidate wins a majority, resolved by randomized timeouts."},
                {"concept": "Heartbeat Mechanism", "explanation": "Empty AppendEntries RPCs sent periodically to prevent followers from starting elections."}
            ],
            "definitions": [
                {"term": "Consensus", "definition": "A fundamental distributed computing primitive whereby a set of processes agree on a common data value or state transition."},
                {"term": "Term", "definition": "An arbitrary period of time governed by an integer counter used to detect obsolete leaders and candidates in Raft."},
                {"term": "Quorum", "definition": "The minimum number of cluster members required to make an authoritative decision, defined as floor(N/2) + 1."}
            ],
            "explanations": [
                "Only the Leader interacts directly with clients; followers redirect client requests to the active leader.",
                "Followers reject RequestVote RPCs if the candidate's last log entry has a lower term, or shorter length at the same term.",
                "Entries are committed only when safely replicated across a strict majority."
            ],
            "important_examples": [
                "Cluster of 5 nodes: Can tolerate up to 2 simultaneous node crashes while maintaining quorum (3 nodes).",
                "Cluster of 3 nodes: Can tolerate 1 node failure (quorum = 2)."
            ],
            "quick_revision_points": [
                "1. Raft splits consensus into Leader Election, Log Replication, and Safety.",
                "2. Randomized timers prevent split-vote loops.",
                "3. Quorum formula: Majority = floor(N/2) + 1.",
                "4. Uncommitted logs can be overwritten; committed logs are immutable."
            ],
            "exam_focus": [
                "Know how to trace an election timeline with split-vote timeouts.",
                "Be ready to compute cluster fault tolerance thresholds (2F+1).",
                "Explain the exact conditions under which a candidate's vote is rejected."
            ]
        }
        db.add(RevisionNote(lecture_id=lec1.id, content=rev1))

        quiz1 = Quiz(lecture_id=lec1.id, title="Distributed Consensus & Raft Protocol Quiz")
        db.add(quiz1)
        db.flush()

        questions_data_1 = [
            {
                "question": "What is the primary design motivation behind the Raft consensus algorithm compared to Paxos?",
                "option_a": "To eliminate the need for leader election entirely",
                "option_b": "To maximize understandability and modular decomposition without sacrificing formal safety",
                "option_c": "To function without majority quorums in unreliable networks",
                "option_d": "To replace network messages with shared hardware memory buffers",
                "correct_answer": "B",
                "explanation": "Ongaro and Ousterhout created Raft specifically to address the extreme pedagogical and implementation complexity of Paxos."
            },
            {
                "question": "In a Raft cluster consisting of 5 nodes, what is the minimum number of nodes required to form a valid quorum?",
                "option_a": "2 nodes",
                "option_b": "3 nodes",
                "option_c": "4 nodes",
                "option_d": "5 nodes",
                "correct_answer": "B",
                "explanation": "Quorum is calculated as floor(N/2) + 1. For 5 nodes, floor(5/2) + 1 = 2 + 1 = 3 nodes."
            },
            {
                "question": "How does Raft resolve the issue of split votes where multiple candidates concurrently solicit votes?",
                "option_a": "By assigning fixed static priorities to node IP addresses",
                "option_b": "By using randomized election timeouts between 150ms and 300ms",
                "option_c": "By allowing nodes to vote for multiple candidates in the same term",
                "option_d": "By shutting down candidate nodes automatically",
                "correct_answer": "B",
                "explanation": "Randomized timeouts ensure that one candidate will almost always time out before others and collect a majority before split competition occurs."
            },
            {
                "question": "Which RPC does a Raft Leader send periodically to maintain its authority and reset follower election timers?",
                "option_a": "RequestVote with empty parameters",
                "option_b": "AppendEntries with empty log entries (Heartbeat)",
                "option_c": "PingCluster RPC",
                "option_d": "QuorumCheck RPC",
                "correct_answer": "B",
                "explanation": "Leaders maintain authority by issuing periodic AppendEntries RPCs containing no log entries (heartbeats)."
            },
            {
                "question": "Under what condition will a follower reject a candidate's RequestVote RPC?",
                "option_a": "If the candidate has fewer total memory resources",
                "option_b": "If the candidate's log is less up-to-date than the follower's own log",
                "option_c": "If the cluster has more than 3 active nodes",
                "option_d": "If the follower is in Candidate state",
                "correct_answer": "B",
                "explanation": "Raft safety enforces that a voter rejects any candidate whose log is less up-to-date than its own."
            }
        ]
        for q in questions_data_1:
            db.add(Question(quiz_id=quiz1.id, **q))

        # ----------------------------------------------------
        # LECTURE 2: Physics - Quantum Mechanics & Wave-Particle Duality
        # ----------------------------------------------------
        lec2 = Lecture(
            user_id=user.id,
            title="Quantum Mechanics: Wave-Particle Duality & The Schrödinger Equation",
            subject="Physics",
            source_type=SourceType.AUDIO_UPLOAD.value,
            duration=2700,
            status=LectureStatus.COMPLETED.value
        )
        db.add(lec2)
        db.flush()

        trans2 = (
            "Good morning physics students. Today we explore the foundational breakdown of classical mechanics and the emergence "
            "of Quantum Theory. By the late 19th century, physicists believed classical mechanics and Maxwell's electromagnetism were "
            "sufficient to describe all physical phenomena. However, blackbody radiation and the photoelectric effect exposed critical flaws.\n\n"
            "In 1905, Albert Einstein explained the photoelectric effect by postulating that light is quantized into packets of energy called "
            "photons, where energy E equals Planck's constant times frequency, E = h nu. In 1924, Louis de Broglie made the revolutionary "
            "hypothesis that if light waves possess particle characteristics, then matter particles like electrons must also exhibit wave properties. "
            "The de Broglie wavelength is defined as lambda equals h divided by momentum p (lambda = h / p).\n\n"
            "This was experimentally confirmed by Davisson and Germer in 1927 through electron diffraction patterns in nickel crystals.\n\n"
            "Next, we examine Werner Heisenberg's Uncertainty Principle formulated in 1927. It states that conjugate variables, such as position x "
            "and momentum p, cannot be simultaneously determined with arbitrary precision. Mathematically: delta x times delta p is greater than or "
            "equal to h-bar over 2, where h-bar is h divided by 2 pi.\n\n"
            "Finally, Erwin Schrödinger formulated the central wave equation of non-relativistic quantum mechanics: i h-bar d psi / dt = H-hat psi, "
            "where H-hat is the Hamiltonian operator representing the total energy of the system. The wave function psi itself is complex-valued, "
            "and its absolute square gives the probability density of finding the particle."
        )
        db.add(Transcript(lecture_id=lec2.id, transcript_text=trans2, language="en"))

        summary2 = (
            "### Lecture Summary: Quantum Mechanics & Wave-Particle Duality\n\n"
            "This physics lecture explores the transition from classical determinism to quantum probabilities, detailing **Wave-Particle Duality**, "
            "the **Photoelectric Effect**, the **De Broglie Hypothesis**, **Heisenberg's Uncertainty Principle**, and the **Schrödinger Wave Equation**.\n\n"
            "#### Key Takeaways:\n"
            "- **Quantization of Energy:** Photons possess discrete energy packets determined by `E = h*nu`.\n"
            "- **Matter Waves:** Moving particles exhibit wavelength `lambda = h/p`, confirmed via electron diffraction.\n"
            "- **Conjugate Uncertainty:** Measurement precision of position and momentum is bounded by `delta_x * delta_p >= h_bar / 2`.\n"
            "- **Statistical Interpretation:** The wave function psi represents probability amplitudes, with `|psi|^2` giving probability density."
        )
        db.add(Summary(lecture_id=lec2.id, summary_text=summary2))

        key_pts2 = [
            {"title": "Photoelectric Effect & Photons", "description": "Light energy is transferred in discrete quanta (photons) rather than continuous classical waves.", "importance": "Critical"},
            {"title": "De Broglie Matter Wavelength", "description": "All particles possess wave characteristics with lambda = h / (m * v).", "importance": "High"},
            {"title": "Heisenberg Uncertainty Principle", "description": "A fundamental physical limit preventing simultaneous exact measurement of conjugate observables.", "importance": "Critical"},
            {"title": "Time-Dependent Schrödinger Equation", "description": "Governs the time-evolution of quantum states via the Hamiltonian operator.", "importance": "High"},
            {"title": "Max Born's Probability Interpretation", "description": "The wave function itself is unobservable; |psi(x,t)|^2 gives the probability of finding the particle at position x.", "importance": "High"}
        ]
        db.add(KeyPoint(lecture_id=lec2.id, content=key_pts2))

        rev2 = {
            "topic": "Quantum Mechanics & Wave Mechanics",
            "important_concepts": [
                {"concept": "Wave-Particle Duality", "explanation": "Entities exhibit both particle-like collisions and wave-like diffraction and interference."},
                {"concept": "Hamiltonian Operator", "explanation": "The quantum operator corresponding to total system energy (kinetic + potential)."},
                {"concept": "Probability Density", "explanation": "The spatial probability distribution calculated as the square of the modulus of the wave function."}
            ],
            "definitions": [
                {"term": "Photon", "definition": "A quantum of electromagnetic radiation carrying energy E = h*nu and momentum p = h/lambda."},
                {"term": "De Broglie Wavelength", "definition": "The wavelength associated with a massive particle, given by lambda = h / p."},
                {"term": "Conjugate Variables", "definition": "Pairs of physical variables whose operators do not commute (e.g., position and momentum, energy and time)."}
            ],
            "explanations": [
                "Higher particle mass yields vanishingly small wavelengths, explaining why macroscopic objects do not exhibit noticeable diffraction.",
                "The uncertainty principle is a fundamental wave property, not an artifact of imperfect measuring instruments.",
                "Wave functions must be normalized such that the integral over all space equals 1."
            ],
            "important_examples": [
                "Electron diffraction through crystal lattices proving matter waves.",
                "Photoelectric work function calculations for metallic surfaces under UV light."
            ],
            "quick_revision_points": [
                "1. E = h*nu = (h*c) / lambda.",
                "2. lambda = h / p = h / (m*v).",
                "3. delta_x * delta_p >= h_bar / 2.",
                "4. |psi|^2 represents spatial probability density."
            ],
            "exam_focus": [
                "Calculate de Broglie wavelength for electrons accelerated through an electric potential V.",
                "Apply Heisenberg's uncertainty principle to estimate ground state energy of a hydrogen atom.",
                "Verify wave function normalization integrals."
            ]
        }
        db.add(RevisionNote(lecture_id=lec2.id, content=rev2))

        quiz2 = Quiz(lecture_id=lec2.id, title="Quantum Mechanics & Wave-Particle Duality Quiz")
        db.add(quiz2)
        db.flush()

        questions_data_2 = [
            {
                "question": "According to Louis de Broglie, what is the wavelength lambda associated with a particle having momentum p?",
                "option_a": "lambda = p / h",
                "option_b": "lambda = h / p",
                "option_c": "lambda = h * p",
                "option_d": "lambda = 2 * pi * h * p",
                "correct_answer": "B",
                "explanation": "De Broglie's relation states that wavelength lambda equals Planck's constant h divided by momentum p (lambda = h / p)."
            },
            {
                "question": "Which experimental observation definitively verified the wave nature of electrons in 1927?",
                "option_a": "The Millikan Oil Drop Experiment",
                "option_b": "The Davisson-Germer Electron Diffraction Experiment",
                "option_c": "The Rutherford Alpha Particle Scattering",
                "option_d": "The Cavendish Torsion Balance",
                "correct_answer": "B",
                "explanation": "Davisson and Germer observed diffraction patterns when scattering electrons off nickel crystals, proving electrons behave as waves."
            },
            {
                "question": "What is the lower bound in the Heisenberg Uncertainty Principle for position and momentum?",
                "option_a": "delta_x * delta_p >= h_bar / 2",
                "option_b": "delta_x * delta_p >= 0",
                "option_c": "delta_x * delta_p = 1",
                "option_d": "delta_x * delta_p <= h / 2",
                "correct_answer": "A",
                "explanation": "The fundamental quantum limit is delta_x * delta_p >= h_bar / 2, where h_bar = h / (2*pi)."
            },
            {
                "question": "What physical quantity is represented by the squared modulus of the wave function |psi(x,t)|^2?",
                "option_a": "The exact instantaneous velocity of the particle",
                "option_b": "The electric charge of the nucleus",
                "option_c": "The probability density of locating the particle at position x and time t",
                "option_d": "The thermodynamic temperature of the system",
                "correct_answer": "C",
                "explanation": "Under Max Born's interpretation, |psi|^2 represents the spatial probability density."
            }
        ]
        for q in questions_data_2:
            db.add(Question(quiz_id=quiz2.id, **q))

        # ----------------------------------------------------
        # LECTURE 3: Biology - Cellular Respiration & ATP Synthase
        # ----------------------------------------------------
        lec3 = Lecture(
            user_id=user.id,
            title="Cellular Respiration, Glycolysis & ATP Synthase",
            subject="Biology",
            source_type=SourceType.AUDIO_UPLOAD.value,
            duration=3400,
            status=LectureStatus.COMPLETED.value
        )
        db.add(lec3)
        db.flush()

        trans3 = (
            "Hello class. Today we will dissect Cellular Respiration, the biochemical process by which eukaryotic cells "
            "extract metabolic energy stored within glucose molecules and convert it into Adenosine Triphosphate (ATP).\n\n"
            "The overall chemical equation is: C6H12O6 + 6 O2 yields 6 CO2 + 6 H2O + approximately 30 to 32 ATP molecules.\n\n"
            "This energy conversion occurs across four sequential metabolic stages:\n"
            "1. Glycolysis: Takes place in the cytoplasm without requiring oxygen. A 6-carbon glucose is enzymatically cleaved "
            "into two 3-carbon pyruvate molecules. This yields a net of 2 ATP (via substrate-level phosphorylation) and 2 NADH.\n\n"
            "2. Pyruvate Oxidation: Pyruvate moves into the mitochondrial matrix, where pyruvate dehydrogenase converts each pyruvate "
            "into Acetyl-CoA, releasing one CO2 and reducing NAD+ to NADH.\n\n"
            "3. The Citric Acid Cycle (Krebs Cycle): In the mitochondrial matrix, each 2-carbon Acetyl-CoA combines with 4-carbon oxaloacetate "
            "to form 6-carbon citrate. The cycle oxidizes carbons into CO2, generating 1 ATP/GTP, 3 NADH, and 1 FADH2 per Acetyl-CoA (multiplied by 2 per glucose).\n\n"
            "4. Oxidative Phosphorylation & Chemiosmosis: In the inner mitochondrial membrane, electrons from NADH and FADH2 are transferred "
            "through protein complexes I through IV in the electron transport chain. Oxygen acts as the terminal electron acceptor, forming water. "
            "The proton gradient built up in the intermembrane space drives the rotary enzyme ATP Synthase to generate the vast majority of cellular ATP."
        )
        db.add(Transcript(lecture_id=lec3.id, transcript_text=trans3, language="en"))

        summary3 = (
            "### Lecture Summary: Cellular Respiration & Bioenergetics\n\n"
            "A comprehensive overview of **Cellular Respiration**, detailing the breakdown of glucose through **Glycolysis**, **Pyruvate Oxidation**, "
            "the **Citric Acid Cycle (Krebs Cycle)**, and **Oxidative Phosphorylation** catalyzed by **ATP Synthase**.\n\n"
            "#### Key Takeaways:\n"
            "- **Net Energy Yield:** 1 molecule of glucose generates ~30 to 32 ATP molecules under aerobic conditions.\n"
            "- **Glycolysis:** Cytoplasmic and anaerobic; produces 2 Net ATP and 2 NADH.\n"
            "- **Krebs Cycle:** Matrix-bound; oxidizes Acetyl-CoA to release CO2 while loading electron carriers NADH & FADH2.\n"
            "- **Chemiosmotic Coupling:** Proton motive force across the inner mitochondrial membrane drives ATP Synthase rotation."
        )
        db.add(Summary(lecture_id=lec3.id, summary_text=summary3))

        key_pts3 = [
            {"title": "Glycolysis Mechanics", "description": "Anaerobic cytoplasmic breakdown of glucose into 2 pyruvates with net gain of 2 ATP.", "importance": "Critical"},
            {"title": "Mitochondrial Matrix Entry", "description": "Pyruvate dehydrogenase converts pyruvate to Acetyl-CoA before Krebs cycle entry.", "importance": "High"},
            {"title": "High-Yield Electron Carriers", "description": "NADH and FADH2 act as high-energy electron shuttles feeding the electron transport chain.", "importance": "High"},
            {"title": "Terminal Electron Acceptor", "description": "Oxygen is the final electron acceptor in the electron transport chain, forming metabolic water.", "importance": "Critical"},
            {"title": "ATP Synthase Rotary Motor", "description": "Chemiosmotic proton flow rotates the F0-F1 subunits to phosphorylate ADP into ATP.", "importance": "Critical"}
        ]
        db.add(KeyPoint(lecture_id=lec3.id, content=key_pts3))

        rev3 = {
            "topic": "Cellular Respiration & Bioenergetics",
            "important_concepts": [
                {"concept": "Substrate-Level Phosphorylation", "explanation": "Direct enzymatic transfer of a phosphate group to ADP, seen in glycolysis and Krebs cycle."},
                {"concept": "Proton Motive Force", "explanation": "Electrochemical gradient generated by pumping H+ ions into the intermembrane space."},
                {"concept": "Aerobic vs Anaerobic Fate", "explanation": "In absence of oxygen, cells undergo fermentation to regenerate NAD+."}
            ],
            "definitions": [
                {"term": "ATP (Adenosine Triphosphate)", "definition": "The primary energy currency of biological cells consisting of adenine, ribose, and three phosphate bonds."},
                {"term": "Chemiosmosis", "definition": "The movement of ions across a semipermeable membrane down their electrochemical gradient to drive cellular work."},
                {"term": "Oxaloacetate", "definition": "A 4-carbon molecule that accepts Acetyl-CoA in the first step of the Krebs cycle to form citrate."}
            ],
            "explanations": [
                "NADH enters at Complex I generating ~2.5 ATP, whereas FADH2 enters at Complex II generating ~1.5 ATP.",
                "Uncoupling proteins can dissipate the proton gradient as heat (thermogenesis) without producing ATP."
            ],
            "important_examples": [
                "Lactic acid fermentation in overworked muscle tissue during strenuous exercise.",
                "Cyanide poisoning inhibiting Complex IV (cytochrome c oxidase) stopping ATP synthesis."
            ],
            "quick_revision_points": [
                "1. Glycolysis: Cytoplasm, 2 ATP, 2 NADH.",
                "2. Pyruvate Oxidation: Matrix, 2 NADH, 2 CO2.",
                "3. Krebs Cycle: Matrix, 2 ATP, 6 NADH, 2 FADH2, 4 CO2.",
                "4. ETC/Chemiosmosis: Inner membrane, ~26-28 ATP."
            ],
            "exam_focus": [
                "Track the carbon atom count at each phase (6C -> 2x3C -> 2x2C -> Citrate 6C).",
                "Explain the role of oxygen as the terminal electron acceptor.",
                "Distinguish between substrate-level phosphorylation and oxidative phosphorylation."
            ]
        }
        db.add(RevisionNote(lecture_id=lec3.id, content=rev3))

        quiz3 = Quiz(lecture_id=lec3.id, title="Cellular Respiration & Bioenergetics Practice Quiz")
        db.add(quiz3)
        db.flush()

        questions_data_3 = [
            {
                "question": "Where does Glycolysis take place within the eukaryotic cell?",
                "option_a": "Mitochondrial Matrix",
                "option_b": "Cytoplasm (Cytosol)",
                "option_c": "Inner Mitochondrial Membrane",
                "option_d": "Nucleolus",
                "correct_answer": "B",
                "explanation": "Glycolysis takes place in the cytoplasm and does not require oxygen or membrane-bound organelles."
            },
            {
                "question": "What is the final (terminal) electron acceptor in the aerobic Electron Transport Chain?",
                "option_a": "Carbon Dioxide (CO2)",
                "option_b": "Molecular Oxygen (O2)",
                "option_c": "Pyruvate",
                "option_d": "Glucose",
                "correct_answer": "B",
                "explanation": "Oxygen is the terminal electron acceptor in aerobic respiration, combining with protons and electrons to form water."
            },
            {
                "question": "What drives the rotary mechanism of ATP Synthase during oxidative phosphorylation?",
                "option_a": "Direct light energy excitation",
                "option_b": "The proton (H+) electrochemical gradient across the inner membrane",
                "option_c": "Breakdown of fatty acid lipids",
                "option_d": "Active RNA transcription",
                "correct_answer": "B",
                "explanation": "The accumulation of protons in the intermembrane space creates a proton motive force that drives ATP Synthase rotation."
            },
            {
                "question": "How many net ATP molecules are produced during Glycolysis per glucose molecule?",
                "option_a": "2 net ATP",
                "option_b": "4 net ATP",
                "option_c": "32 net ATP",
                "option_d": "0 net ATP",
                "correct_answer": "A",
                "explanation": "Glycolysis uses 2 ATP during the investment phase and generates 4 ATP, resulting in a net yield of 2 ATP."
            }
        ]
        for q in questions_data_3:
            db.add(Question(quiz_id=quiz3.id, **q))

        # ----------------------------------------------------
        # LECTURE 4: Mathematics - Linear Algebra & Eigenvalues
        # ----------------------------------------------------
        lec4 = Lecture(
            user_id=user.id,
            title="Linear Algebra: Eigenvalues, Eigenvectors & Matrix Diagonalization",
            subject="Mathematics",
            source_type=SourceType.AUDIO_UPLOAD.value,
            duration=2900,
            status=LectureStatus.COMPLETED.value
        )
        db.add(lec4)
        db.flush()

        trans4 = (
            "Welcome back to Advanced Linear Algebra. Today we explore one of the most practical and profound concepts in all of mathematics: "
            "Eigenvalues, Eigenvectors, and Matrix Diagonalization.\n\n"
            "When a square matrix A acts on a vector x, it typically scales and rotates the vector. However, for certain special non-zero vectors x, "
            "the transformation A*x results in a vector that lies in the exact same direction as x, scaled by a scalar factor lambda.\n\n"
            "This gives us the fundamental eigenvalue equation: A * v = lambda * v, where v is a non-zero eigenvector and lambda is its corresponding eigenvalue.\n\n"
            "To solve for eigenvalues, we rewrite the equation as (A - lambda * I) * v = 0. Because v cannot be the zero vector, the matrix (A - lambda * I) "
            "must be singular. Therefore, its determinant must equal zero: det(A - lambda * I) = 0. This polynomial in lambda is known as the Characteristic Equation.\n\n"
            "Once eigenvalues are found, we substitute each lambda back into (A - lambda * I) * v = 0 to solve for the basis of the null space, which gives the eigenvectors.\n\n"
            "If an n x n matrix A has n linearly independent eigenvectors, we can form a modal matrix P whose columns are the eigenvectors. Then A can be diagonalized "
            "as A = P * D * P^(-1), where D is a diagonal matrix containing the eigenvalues along the main diagonal."
        )
        db.add(Transcript(lecture_id=lec4.id, transcript_text=trans4, language="en"))

        summary4 = (
            "### Lecture Summary: Eigenvalues & Diagonalization\n\n"
            "An analytical exploration of **Eigenvalues**, **Eigenvectors**, the **Characteristic Polynomial**, and **Matrix Diagonalization** "
            "with applications to systems of differential equations, PageRank, and machine learning PCA.\n\n"
            "#### Key Takeaways:\n"
            "- **Fundamental Equation:** `A * v = lambda * v` where `v != 0`.\n"
            "- **Characteristic Determinant:** Roots of `det(A - lambda * I) = 0` yield the spectrum of eigenvalues.\n"
            "- **Eigenspace Computation:** Finding the nullspace `null(A - lambda * I)` yields the eigenvectors.\n"
            "- **Diagonalization Formula:** `A = P * D * P^(-1)` transforms coupled linear operations into uncoupled coordinates."
        )
        db.add(Summary(lecture_id=lec4.id, summary_text=summary4))

        key_pts4 = [
            {"title": "The Eigenvalue Relation", "description": "Matrix transformation acts purely as a scalar stretching along eigenvector directions.", "importance": "Critical"},
            {"title": "Characteristic Equation", "description": "det(A - lambda*I) = 0 yields an nth degree polynomial whose roots are the eigenvalues.", "importance": "High"},
            {"title": "Geometric vs. Algebraic Multiplicity", "description": "A matrix is diagonalizable if and only if geometric multiplicity matches algebraic multiplicity for all eigenvalues.", "importance": "High"},
            {"title": "Matrix Powers via Diagonalization", "description": "Computing A^k becomes trivial: A^k = P * (D^k) * P^(-1).", "importance": "Critical"}
        ]
        db.add(KeyPoint(lecture_id=lec4.id, content=key_pts4))

        rev4 = {
            "topic": "Linear Algebra & Spectral Theory",
            "important_concepts": [
                {"concept": "Eigenvector Direction Invariance", "explanation": "Vectors whose directions remain unchanged during a linear transformation."},
                {"concept": "Diagonal Matrix D", "explanation": "A matrix with zeros everywhere except the main diagonal which holds the eigenvalues."},
                {"concept": "Trace and Determinant Identities", "explanation": "Trace(A) = sum of eigenvalues; det(A) = product of eigenvalues."}
            ],
            "definitions": [
                {"term": "Eigenvalue", "definition": "A scalar lambda satisfying A*v = lambda*v for a non-zero vector v."},
                {"term": "Characteristic Polynomial", "definition": "The polynomial p(lambda) = det(A - lambda*I)."},
                {"term": "Diagonalizable Matrix", "definition": "A square matrix similar to a diagonal matrix, satisfying A = P*D*P^(-1)."}
            ],
            "explanations": [
                "Symmetric real matrices always have real eigenvalues and an orthonormal basis of eigenvectors.",
                "If det(A) = 0, then at least one eigenvalue must be 0."
            ],
            "important_examples": [
                "Calculating matrix powers A^100 by diagonalizing into P * D^100 * P^(-1).",
                "Decoupling systems of differential equations dx/dt = A*x."
            ],
            "quick_revision_points": [
                "1. A*v = lambda*v.",
                "2. det(A - lambda*I) = 0.",
                "3. Trace(A) = sum(lambda_i).",
                "4. det(A) = prod(lambda_i)."
            ],
            "exam_focus": [
                "Find eigenvalues and eigenvectors for 2x2 and 3x3 matrices.",
                "Construct matrix P and verify that P^(-1)*A*P = D.",
                "Test whether a matrix with repeated roots is defective or diagonalizable."
            ]
        }
        db.add(RevisionNote(lecture_id=lec4.id, content=rev4))

        quiz4 = Quiz(lecture_id=lec4.id, title="Linear Algebra & Eigenvalues Quiz")
        db.add(quiz4)
        db.flush()

        questions_data_4 = [
            {
                "question": "What is the condition used to determine the eigenvalues of an n x n square matrix A?",
                "option_a": "det(A - lambda * I) = 0",
                "option_b": "trace(A) = 0",
                "option_c": "A * I = 0",
                "option_d": "A^(-1) = lambda * I",
                "correct_answer": "A",
                "explanation": "Eigenvalues are the roots of the characteristic equation det(A - lambda * I) = 0."
            },
            {
                "question": "If a matrix A is diagonalizable as A = P * D * P^(-1), what do the columns of matrix P represent?",
                "option_a": "The rows of the inverse matrix",
                "option_b": "The linearly independent eigenvectors of matrix A",
                "option_c": "Random orthogonal basis vectors",
                "option_d": "The eigenvalues of matrix A",
                "correct_answer": "B",
                "explanation": "The modal matrix P is formed by placing the linearly independent eigenvectors of A as its columns."
            },
            {
                "question": "True or False: The determinant of matrix A equals the product of all its eigenvalues.",
                "option_a": "True",
                "option_b": "False",
                "option_c": "Only for 2x2 matrices",
                "option_d": "Only for identity matrices",
                "correct_answer": "A",
                "explanation": "True. For any square matrix, det(A) is mathematically equal to the product of all its eigenvalues."
            }
        ]
        for q in questions_data_4:
            db.add(Question(quiz_id=quiz4.id, **q))

        # ----------------------------------------------------
        # Sample Student Notes & Quiz Attempts
        # ----------------------------------------------------
        note1 = Note(
            user_id=user.id,
            lecture_id=lec1.id,
            title="My Raft Algorithm Implementation Notes",
            content="# Raft Study Notes\n\n- Key trick is **randomized election timeouts** (150ms-300ms).\n- Must remember: A leader never overwrites its own log entries; it only appends.\n- Term counter acts as a logical clock.\n- Safety: Candidates must have latest log to win elections.",
            subject="Computer Science",
            tags="distributed-systems,raft,exam-prep",
            is_favorite=True
        )
        note2 = Note(
            user_id=user.id,
            lecture_id=lec2.id,
            title="Quantum Formula Cheat Sheet",
            content="# Quantum Equations Cheat Sheet\n\n$$\\lambda = \\frac{h}{p} = \\frac{h}{mv}$$\n\n$$\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$$\n\n$$i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi$$\n\nRemember: $|\\psi|^2$ gives probability density, not particle position!",
            subject="Physics",
            tags="quantum,formulas,cheat-sheet",
            is_favorite=True
        )
        note3 = Note(
            user_id=user.id,
            lecture_id=lec3.id,
            title="Cellular Respiration ATP Yield Summary",
            content="# Bioenergetics Yield Table\n\n| Stage | Location | ATP Yield | Carrier Yield |\n|---|---|---|---|\n| Glycolysis | Cytosol | 2 Net ATP | 2 NADH |\n| Pyruvate Oxid. | Matrix | 0 ATP | 2 NADH |\n| Citric Acid Cycle | Matrix | 2 ATP | 6 NADH, 2 FADH2 |\n| Oxidative Phos. | Inner Memb. | ~26-28 ATP | H+ gradient |",
            subject="Biology",
            tags="biology,atp,respiration",
            is_favorite=False
        )
        db.add_all([note1, note2, note3])

        # Sample Quiz Attempts for dashboard metrics
        attempt1 = QuizAttempt(
            user_id=user.id,
            quiz_id=quiz1.id,
            score=4,
            percentage=80.0
        )
        attempt2 = QuizAttempt(
            user_id=user.id,
            quiz_id=quiz2.id,
            score=4,
            percentage=100.0
        )
        attempt3 = QuizAttempt(
            user_id=user.id,
            quiz_id=quiz3.id,
            score=3,
            percentage=75.0
        )
        db.add_all([attempt1, attempt2, attempt3])

        db.commit()
        print("Rich multi-disciplinary database seed completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
