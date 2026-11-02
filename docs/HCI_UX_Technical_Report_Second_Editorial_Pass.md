# Event Management Platform
## HCI/UX Technical Report — Editorially Consolidated Edition

**Project focus:** Internal Event Operations and Coordination  
**Primary users:** ADMIN / Admin Team Lead and STAFF  
**Secondary user:** AUDIENCE / ATTENDEE  
**Revision:** Second editorial pass  
**Evidence status:** No fabricated user-research or usability-test results are included.

---

# Table of Contents

1. Introduction  
2. User Analysis  
3. User Journey Development  
4. Prototype Design  
5. Engineering Decisions  
6. Testing Plan  
7. References  
8. Appendices

---

# 1. INTRODUCTION

## 1.1 Background and Context
Live events are complex operational environments in which multiple people, teams, responsibilities, and activities must be coordinated within a limited period of time. Concerts, theater productions, plays, recitals, conferences, and other organized live productions require personnel to perform tasks simultaneously while responding to changes that may occur throughout the event. Unlike many conventional workplace environments, these activities frequently take place under time pressure, with users moving through physical spaces, interacting with equipment and other people, and working in environments affected by noise, crowds, low-light conditions, fatigue, and changing priorities.

Within this context, effective coordination between administrative personnel and operational staff is particularly important. The Event Management Platform developed in this project is intended to support this coordination by providing a centralized operational environment for communication, task delegation, responsibility management, status tracking, and awareness of ongoing event activities. The purpose is not to provide a conventional event-ticketing, event-booking, or event-discovery service. Instead, the primary focus is **internal event operations**: helping the people responsible for producing an event communicate, organize work, monitor responsibilities, and respond to operational changes while the event is taking place.

The project identifies two primary operational user groups: **ADMIN / Admin Team Lead** and **STAFF**. Although both interact with the same system, they have substantially different responsibilities and contexts of use. The ADMIN is responsible for coordinating personnel, delegating tasks, monitoring progress, managing operational priorities, and maintaining a broad view of the event. In contrast, STAFF members execute assigned tasks within specific areas of the event and require rapid access to instructions, priorities, task information, and status controls while frequently moving through the venue. The project therefore treats these users as distinct user contexts rather than as a single user type differentiated only by permissions.

This distinction is consistent with a human-centred approach to interactive-system design. ISO 9241-210:2019 emphasizes the importance of understanding users, their needs, and their contexts of use throughout the design process. Similarly, ISO 9241-11:2018 frames usability in relation to specified users, goals, and contexts rather than treating usability as an isolated property of an interface (International Organization for Standardization [ISO], 2018, 2019). For the Event Management Platform, this means that an interface cannot be considered successful simply because it functions technically. Its usefulness must be considered in relation to the conditions under which ADMIN and STAFF actually perform their work.

The project also identifies **AUDIENCE/ATTENDEE** as a secondary user group. The audience-facing experience is intended to provide functions such as event-related photo uploads and comments and is expected to have a more visual and social character. However, this experience is not the central operational problem addressed by the project. The primary HCI challenge remains the coordination of ADMIN and STAFF during internal event operations.

## 1.2 Problem Statement
The central problem addressed by the Event Management Platform is not simply that event management is difficult. Rather, the project identifies a combination of **communication friction, fragmented workflows, unclear task ownership, limited task-status visibility, insufficient operational awareness, cognitive workload, time pressure, changing priorities, unreliable connectivity, and limited structured information after an event**.

The existing operational context may require personnel to communicate through multiple tools and channels, including WhatsApp and walkie-talkies. As a result, information can become fragmented across different communication mechanisms and software applications. The project context identifies situations in which ADMIN personnel may not know what individual STAFF members are doing, what responsibilities they have, whether assigned tasks have been completed, or who is currently responsible for a particular area. At the same time, STAFF may need to work quickly while using fragmented tools and dealing with interfaces that can make the flow of information slower or more confusing. These conditions can create uncertainty about what should happen next and whether an instruction or task update has been successfully communicated.

The operational environment can further increase these problems. STAFF may be walking through the venue, carrying equipment, performing physical work, or interacting with other people while attempting to access information. Both ADMIN and STAFF may experience stress, fatigue, multitasking, distractions, and changing priorities. The project consequently identifies working-memory limitations, information saturation, and increased workload as relevant cognitive concerns. Wickens' (2008) Multiple Resources Theory provides a useful theoretical basis for understanding why simultaneous activities can produce task interference and workload overload, particularly when multiple tasks compete for limited cognitive or perceptual resources.

The problem is also related to **situation awareness**. During a live event, users need to understand not only what they personally have to do, but also what is currently happening, which tasks remain pending, who is responsible for particular areas, and what requires attention. Endsley (1995) describes situation awareness as an important component of decision making in dynamic systems and identifies attention and working memory as factors that can limit the acquisition and interpretation of information. These considerations are particularly relevant to an event environment in which operational conditions can change rapidly.

Connectivity introduces another dimension of the problem. The project identifies poor or unreliable internet connectivity as a potential threat to communication reliability. Consequently, the system should not assume that every message or status change will be transmitted and processed instantaneously. From an HCI perspective, this also creates a need for the interface to communicate system state clearly. Nielsen's (1994) usability heuristics identify visibility of system status as a fundamental usability concern. For this project, this principle is particularly relevant to communication: users may need to understand whether an instruction has been sent, received, processed, is still pending, or has failed.

Finally, the project identifies a lack of structured post-event information as an operational problem. After an event, ADMIN personnel may have difficulty determining what happened, which tasks were successful or delayed, what problems occurred, and what could be improved in a future production. Therefore, the system is intended not only to support immediate coordination but also to preserve useful operational information that can contribute to later review and learning.

## 1.4 Objectives
The overall objective of the Event Management Platform is to design a human-centred system that supports effective internal coordination during live-event operations while accounting for the different needs and contexts of ADMIN and STAFF.

The specific objectives of the project are to:
1. **Reduce communication friction** by providing a centralized environment for operational communication and information exchange.
2. **Reduce unnecessary cognitive workload** by presenting relevant information clearly and minimizing unnecessary decisions, navigation, and memory demands.
3. **Improve task visibility** by making task status, deadlines, priorities, and progress easier to understand.
4. **Improve responsibility and ownership visibility** by clearly associating tasks and operational areas with their assigned personnel or teams.
5. **Support faster communication** through interaction patterns designed for time-sensitive event conditions.
6. **Improve situation awareness** by helping ADMIN understand the broader operational state and helping STAFF understand the information immediately relevant to their work.
7. **Provide role-appropriate information** so that ADMIN and STAFF receive interfaces and information structures appropriate to their responsibilities rather than identical experiences based only on permissions.
8. **Support mobile interaction**, particularly for STAFF who primarily use smartphones while moving through the event environment.
9. **Consider accessibility** through readable interfaces, adequate contrast, clear labels and icons, visible interaction states, non-color-dependent communication, and responsive layouts.
10. **Consider unreliable network conditions** by treating communication status, response time, delivery confirmation, and possible degraded or offline operation as important system-level and UX concerns.
11. **Preserve useful post-event information** so that operational experiences can potentially be reviewed and used to identify problems, successes, and opportunities for future improvement.

These objectives are design-oriented rather than claims of demonstrated performance. At this stage of the project, they describe the intended qualities and outcomes of the system. Their effectiveness would need to be evaluated through usability and user testing under representative conditions. This approach is consistent with ISO 9241-11:2018, which places usability within the context of actual use and identifies evaluation as a common application of the standard.

## 1.6 Scope and Boundaries
The scope of the project is centered on **internal event operations and coordination**. The principal functions and concepts supported by the current project context include event and team coordination, role-based views, task assignment, task-status tracking, deadlines, responsibility management, team and area monitoring, operational communication, team-member information, responsive multi-device interaction, accessibility considerations, immediate system feedback, communication delivery awareness, and post-event information retention.

The project is intended for live-event environments such as concerts, theater productions, plays, recitals, conferences, and similar organized productions. STAFF interaction is expected to prioritize smartphones because these users may be moving through the venue, while ADMIN may require a broader coordination and monitoring experience that can make use of computers, tablets, or phones.

The project does **not** primarily address event ticketing, ticket sales, event discovery, or general consumer event-booking workflows. Although AUDIENCE is included as a secondary user group, its current role is focused primarily on event-related photos and comments. The audience-facing experience is therefore outside the central operational problem addressed in this report.

Several aspects remain outside the finalized scope because the project context identifies them as unresolved or conditional. Audio or walkie-talkie-style communication is a potential feature but depends on development time and technical capability. Audience participation without login remains an open question requiring further usability, privacy, and security evaluation. Similarly, the precise behavior of offline or degraded-mode operation has not yet been finalized. Exact navigation structures, screen layouts, notification rules, and detailed interaction mechanisms are also not established requirements at this stage.

These boundaries are important because the report distinguishes documented project requirements from design proposals and future decisions. The current project context explicitly states that unsupported features, workflows, technical mechanisms, or policies should not be treated as established requirements. Therefore, later design decisions will be presented as proposals, inferences, or open questions when they extend beyond the documented evidence.

# 2. USER ANALYSIS

The user analysis of the Event Management Platform is based on the understanding that the system will be used within dynamic live-event environments rather than in a conventional office setting. The project identifies ADMIN and STAFF as the two primary operational user groups and AUDIENCE as a secondary user group. Although these users interact with the same platform, their responsibilities, goals, information needs, physical contexts, and interaction demands are substantially different. Consequently, the analysis does not treat ADMIN and STAFF as a single user population with different permissions. Instead, they are understood as distinct users participating in the same operational system.

This distinction is consistent with human-centred design principles, which emphasize understanding users, their goals, tasks, and contexts before defining interactive solutions (International Organization for Standardization [ISO], 2019a). Similarly, usability should be considered in relation to the conditions under which users actually interact with a system rather than as an isolated property of the interface (ISO, 2018). For this project, these conditions include movement, noise, crowds, low-light environments, physical workload, stress, multitasking, changing priorities, and unreliable connectivity.

## 2.1 Target Users
The primary target users of the Event Management Platform are **ADMIN / Admin Team Lead** and **STAFF**. Both participate directly in event operations, but they occupy different positions within the organizational and information structure of an event. ADMIN is responsible for coordination, delegation, monitoring, intervention, and broader operational awareness, whereas STAFF primarily executes assigned work and communicates information about tasks and local conditions.

The distinction is therefore not limited to organizational authority. It also affects the type and amount of information each user needs to process. The project context identifies the central ADMIN question as understanding what is happening across the event and team, while the central STAFF question is understanding what needs to be done immediately. This difference has direct implications for interface design because users who perform different tasks under different conditions should not necessarily receive the same information or interaction structure.

Persona development literature similarly emphasizes the value of representing users according to their goals, behaviors, needs, and contexts rather than treating a product's entire population as homogeneous (Pruitt & Adlin, 2006). In this project, the ADMIN and STAFF personas therefore function as analytical representations of two operational roles. They should not be interpreted as evidence that every individual in these roles behaves identically.

The project also identifies **AUDIENCE/ATTENDEE** as a secondary user group. Unlike ADMIN and STAFF, audience members are not primarily involved in the internal coordination of the event. Their planned interaction is more visual and social, particularly through photo uploads and comments. Consequently, their experience belongs to the broader platform but does not define the central operational problem addressed by this report.

The target-user analysis can therefore be summarized as follows:
* **ADMIN:** maintains a broad operational view, coordinates people, delegates work, monitors progress, and intervenes when necessary.
* **STAFF:** performs operational tasks, receives and communicates information, updates status, and works within specific event areas.
* **AUDIENCE:** interacts with the event from the attendee perspective through the planned social and visual experience.

This role differentiation is particularly important because collaborative systems may require different participants to maintain different but compatible representations of a shared situation rather than forcing every participant to access identical information (Salmon et al., 2010).

## 2.3 ADMIN Persona
The project's ADMIN persona represents an Executive Producer / Admin Team Lead involved in high-level stage productions and event management. The persona's importance to the system is not primarily determined by demographic characteristics but by the combination of **coordination responsibility, decision-making, information management, and operational pressure** associated with the role.

ADMIN's principal challenge is maintaining a sufficiently accurate understanding of event state while coordinating multiple people and activities. The project context identifies uncertainty about task status, responsibility, substitutions, communication, and post-event performance as recurring concerns. These concerns indicate that ADMIN's problem is not simply a lack of productivity features. It is fundamentally an information and coordination problem.

## 2.4 STAFF Persona
The STAFF persona represents an operational event worker whose responsibilities are more directly connected to task execution. The persona's context includes concerts and plays, fast-changing workflows, communication problems, heavy workload, and the need to work quickly.

The most important characteristic of STAFF from an HCI perspective is the combination of **physical activity and digital interaction**. STAFF may move through the venue, carry equipment, work in crowded spaces, and interact with a smartphone while simultaneously maintaining attention on the physical environment.

## 2.5 AUDIENCE as a Secondary User
AUDIENCE represents a different interaction context. Audience members are not primarily responsible for event coordination and are therefore outside the central operational problem addressed by the platform.

The project currently positions the audience-facing experience around:
* photo uploads;
* comments;
* visual interaction;
* social participation.

The project context explicitly differentiates this experience from the operational ADMIN/STAFF experience, which prioritizes speed, responsiveness, task completion, and coordination.

Consequently, AUDIENCE should not be used to justify the same interaction requirements as ADMIN or STAFF. For example, low cognitive overhead under operational time pressure is primarily relevant to ADMIN and STAFF, whereas the audience experience is intended to provide a more visual and socially oriented interaction.

An unresolved question is whether audience participation should require authentication. The project currently identifies this as an open issue because usability, privacy, and security implications require further evaluation. Therefore, this report does not assume a specific login model.

Similarly, moderation of audience-generated content would be a reasonable future design question, but it is not currently a documented project requirement and should not be treated as one.

## 2.6 Context of Use
The context of use is one of the most important dimensions of the user analysis because the platform is intended for live-event environments rather than controlled office environments. ISO 9241-11 emphasizes that usability must be understood in relation to actual conditions of use, while ISO 9241-210 emphasizes understanding users, tasks, and contexts as part of human-centred design (ISO, 2018, 2019a).

The project's documented conditions include movement, equipment handling, multitasking, time pressure, noise, crowds, low light, fatigue, stress, changing priorities, and unreliable connectivity.

## 2.9 Comparative User Analysis
The comparison between ADMIN and STAFF demonstrates why a role-based interface is necessary.

ADMIN operates at a broader organizational level. The user needs to maintain event-wide visibility, make decisions, delegate work, monitor progress, and intervene when necessary. Consequently, ADMIN can require greater information breadth and richer coordination controls.

STAFF operates at a more local execution level. The user needs immediate access to current tasks, priorities, instructions, and status interactions while potentially moving through the physical environment. Consequently, STAFF benefits from focused information and low interaction complexity.

This distinction can also be understood through distributed situation awareness. A collaborative system does not necessarily require every participant to maintain an identical representation of the entire situation; rather, information can be distributed according to participants' roles and interactions (Salmon et al., 2010).

| Dimension | ADMIN | STAFF |
| :--- | :--- | :--- |
| **Primary goal** | Coordinate and maintain operational control | Execute assigned operational work |
| **Main perspective** | Event-wide | Task/area-specific |
| **Decision-making** | Assign, prioritize, intervene, reassign | Execute, report, respond |
| **Information need** | Broad status and relationships between tasks, people, and areas | Immediate task, priority, instruction, and status |
| **Situation awareness** | Global/event-level | Local/task-level |
| **Communication role** | Primarily coordinates and delegates | Receives, responds, and reports |
| **Interaction frequency** | Repeated monitoring and intervention | Frequent short interactions during work |
| **Physical context** | May vary; broader coordination context | Often moving and potentially carrying equipment |
| **Device priority** | Multi-device context | Smartphone is especially important |
| **Cognitive challenge** | Maintaining broad awareness and making decisions | Performing physical work while processing information |
| **Main pain point** | Lack of visibility and coordination | Slow/confusing/fragmented interaction |
| **Information density** | Greater breadth may be necessary | Information should be focused on role and current task |
| **Post-event need** | Review performance and improve future events | Contribute task/status information to the retained record |

The comparison demonstrates that the difference between ADMIN and STAFF is not adequately represented by a conventional permission hierarchy. Their differences involve **goals, responsibilities, information needs, cognitive demands, physical environments, and interaction patterns**.

This is the primary analytical justification for role-based UX in the Event Management Platform.

## 2.10 User Requirements Derived from the Analysis
The following requirements are derived from the combination of the project context and the external HCI/Human Factors evidence. They should be understood as **user-centered requirements and design implications**, not as a finalized technical specification.

# 3. USER JOURNEY DEVELOPMENT

## 3.2 Current ADMIN Journey
The current ADMIN journey is characterized by an event-level coordination perspective. The ADMIN needs to understand what is happening across the event, identify problems or gaps, assign responsibility, communicate with STAFF, monitor progress, and respond when conditions change. The project documentation identifies the central ADMIN problem as a lack of visibility and coordination.

The current journey can therefore be understood as a sequence in which the ADMIN attempts to reconstruct the state of the event while simultaneously coordinating people and tasks. The documented journey focus is:
Understand event state $\rightarrow$ identify gaps/priorities $\rightarrow$ assign responsibility $\rightarrow$ communicate $\rightarrow$ monitor $\rightarrow$ intervene $\rightarrow$ close tasks $\rightarrow$ review event outcome.

At the beginning of the journey, the ADMIN needs to determine the current state of the event. This involves checking available information and understanding which activities are occurring, which tasks require attention, and whether responsibilities are clear. When information is distributed across fragmented communication tools, obtaining this overview becomes more difficult. The problem is not simply that information exists in multiple locations; the ADMIN must also mentally combine that information into a coherent representation of the event.

Once a gap or priority is identified, the ADMIN must assign responsibility. This creates an important dependency between coordination and communication. An assignment is only useful if the responsible STAFF member understands what must be done and can act on it. If responsibility is unclear, the ADMIN may need additional communication to determine who is handling the task.

The journey then moves into monitoring. The ADMIN must determine whether assigned tasks are progressing and whether the event remains aligned with its operational requirements. This monitoring process can become difficult when task status is not immediately visible. The ADMIN may need to communicate with STAFF to determine whether a task has been started, completed, delayed, or affected by another problem.

Uncertainty is therefore an important characteristic of the current ADMIN journey. A lack of visible status can force the ADMIN to search for information or ask additional questions. Under live-event conditions, this uncertainty can become more consequential because priorities may change quickly. Situation awareness research is relevant here because effective operation in dynamic environments depends on acquiring and interpreting information about the current situation (Endsley, 1995; Durso & Sethumadhavan, 2008).

When a problem occurs, the ADMIN must intervene. Intervention may require identifying the problem, determining who is responsible, communicating a new instruction, and monitoring the result. The current project evidence does not establish a specific implemented workflow for these interventions or for staff substitution; therefore, these activities should be understood as operational needs rather than validated interface behaviors.

Finally, the current journey includes closing tasks and reviewing the event outcome. The project identifies lack of post-event information as another problem. Without adequate information after the event, it can become difficult to reconstruct what happened, understand unresolved issues, or learn from the event.

Thus, the current ADMIN journey is not necessarily characterized by a lack of activity. Rather, it is characterized by the effort required to obtain sufficient visibility and coordinate activity across fragmented information and communication processes.

## 3.3 Current STAFF Journey
The STAFF journey is different because STAFF members operate primarily at the task level and may be physically moving through the event environment. The project documentation identifies the STAFF journey as:
Receive instruction $\rightarrow$ understand priority $\rightarrow$ execute task $\rightarrow$ communicate/update status $\rightarrow$ respond to changes $\rightarrow$ complete task.

The first stage is receiving an instruction. The instruction may communicate what the STAFF member needs to accomplish, but its usefulness depends on whether the information can be understood quickly. STAFF may be operating under conditions involving movement, noise, crowds, low light, fatigue, stress, and changing priorities. Consequently, an interaction that might be acceptable in a quiet office environment could become inefficient in a live event.

The next stage is interpreting the information and determining its priority. This is particularly important because STAFF should not have to spend unnecessary time interpreting an unclear instruction before beginning the physical task. The issue is therefore connected to both usability and situation awareness. If the system does not communicate the relevant information clearly, the user must devote additional cognitive resources to determining what is happening and what should be done next.

The journey then moves into task execution. At this point, the system may no longer be the user's primary focus. The STAFF member may be interacting with people, equipment, spaces, or physical activities related to the event. This makes interaction cost particularly important. Patrício et al. (2008) argue that different service activities may require different interfaces or forms of interaction. In the context of this project, the implication is that system interactions should be appropriate to the operational activity being performed rather than assuming continuous attention to the interface.

After or during execution, STAFF members need to communicate status. The project identifies fragmented or slow communication workflows as a central pain point. Switching between tools can increase interaction overhead and potentially delay the transfer of important information.

The journey also includes responding to changing conditions. An instruction received earlier may become outdated if the event situation changes. STAFF therefore needs a way to recognize relevant updates and adapt their actions. This characteristic distinguishes the journey from a simple linear task flow. The user's experience can change while a task is already in progress.

Finally, the task is completed and the STAFF member communicates or records the resulting status. The quality of this final interaction affects the ADMIN's ability to understand the broader event state. Consequently, STAFF and ADMIN journeys are interconnected: a delayed or unclear STAFF update can create uncertainty for ADMIN, while an unclear ADMIN instruction can create additional work for STAFF.

## 3.4 Proposed ADMIN Journey
The following journey is a **proposed design model** derived from the project's documented requirements and HCI research. It has not been implemented or validated with users.

The proposed ADMIN flow is:
Understand event state $\rightarrow$ identify priority $\rightarrow$ assign task/owner $\rightarrow$ communicate $\rightarrow$ monitor $\rightarrow$ intervene $\rightarrow$ complete $\rightarrow$ review.

The model restructures the current journey around continuous event visibility and explicit responsibility. This does not imply that every event must follow the same rigid sequence. Instead, the stages represent recurring coordination activities that can overlap during live operations.

## 3.5 Proposed STAFF Journey
The proposed STAFF journey is also a **design proposal**, not a validated workflow. It is based on the documented STAFF needs and the requirement for fast, understandable, mobile-oriented interaction in a dynamic environment.

The proposed flow is:
Receive $\rightarrow$ understand $\rightarrow$ execute $\rightarrow$ update $\rightarrow$ adapt $\rightarrow$ complete.

## 3.6 Critical Interaction Points
Not all stages of a journey have equal operational consequences. A critical interaction point is a moment at which the outcome of a user's interaction can substantially affect subsequent activities. Rosenbaum et al. (2017) demonstrate why journey analysis should distinguish between more and less important touchpoints instead of treating all interactions as equivalent.

This distinction is particularly relevant to live events because time pressure and operational dependency can amplify the consequences of small interaction failures. For example, a delayed acknowledgement may prevent an ADMIN from knowing whether a STAFF member received an urgent instruction. Similarly, an unclear status may cause an ADMIN to believe that a task is progressing when it has actually been delayed.

The following interaction points are therefore especially important for this platform:
* **Receiving an urgent instruction:** The STAFF member needs to recognize that the instruction has arrived and understand its importance quickly. A failure here can delay task execution and may require additional communication.
* **Assigning a task:** The ADMIN needs to establish who is responsible. An ambiguous assignment can create duplicated work or leave a task without clear ownership.
* **Acknowledging a task:** Acknowledgement provides a connection between ADMIN intent and STAFF awareness. Without confirmation, the ADMIN may remain uncertain about whether the instruction was received.
* **Changing task status:** Status changes are important because they transfer information about the progress of work from STAFF to ADMIN. If status information is delayed or ambiguous, event-level situation awareness can degrade.
* **Identifying a delayed task:** A delayed task represents a point where monitoring becomes intervention. The ADMIN needs enough information to recognize the delay and decide whether additional action is required.
* **Communicating under poor connectivity:** Network reliability can affect whether information is delivered, updated, or confirmed. The system should communicate its current state rather than leaving users to assume that an action succeeded.
* **Replacing or substituting STAFF:** Staff substitution can become important when the original responsible person cannot complete a task. The project identifies substitution visibility as a relevant consideration, but the exact workflow remains unresolved. Therefore, the design should treat substitution as a proposed requirement rather than a validated feature.
* **Confirming message delivery:** The distinction between sending a message and knowing that it was successfully delivered is important in operational communication. Explicit feedback can reduce uncertainty and support the ADMIN's understanding of the current communication state.

These points illustrate why the journey cannot be evaluated solely by counting clicks or measuring isolated task completion. The consequences of an interaction depend on its position in the broader operational process.

## 3.8 Opportunities for Improvement
The journey analysis translates the documented pain points into potential design opportunities. These opportunities are not claims that a specific solution has already been proven effective. Instead, they represent areas where the proposed platform could reduce friction and improve coordination.

First, the platform could provide **a consolidated operational view for ADMIN**. Rather than requiring the ADMIN to reconstruct event state from multiple communication sources, the system could present relevant tasks, ownership, priorities, and statuses in a coherent representation. This opportunity follows from the documented visibility problem and from situation-awareness principles.

Second, the platform could provide **explicit task ownership**. Assignment should communicate not only that a task exists but also who is responsible for it. This could reduce ambiguity during monitoring and make intervention more targeted.

Third, the platform could provide **role-relevant communication integrated with task information**. The purpose would not be to eliminate every possible external communication channel, but to reduce unnecessary separation between instructions, tasks, and status information. Patricio et al. (2008) show the value of considering which activities are best supported through different interfaces and how those interfaces should be integrated.

Fourth, the STAFF experience could prioritize **rapid comprehension and low interaction overhead**. The most important information for an active task should be easy to recognize without requiring extensive navigation. This is particularly relevant given the documented mobile and physical context of STAFF.

Fifth, the platform could provide **clear feedback for communication and status changes**. Confirmation is particularly important when an action affects another user's work. If an ADMIN assigns a task, or STAFF changes a task status, the system should make the resulting state understandable.

Sixth, the journey suggests an opportunity for **explicit handling of changing priorities**. Because event conditions can change while tasks are in progress, the system should help users distinguish current information from information that has become outdated. This supports situation awareness by helping users maintain an appropriate representation of the current operational state.

Seventh, the platform could provide **clear visibility into delayed or unresolved tasks**. Instead of requiring ADMIN to discover delays through separate conversations, task monitoring could make relevant exceptions easier to recognize. Rosenbaum et al. (2017) demonstrate the value of identifying critical touchpoints rather than treating every journey stage equally.

Eighth, the journey identifies **communication reliability as a design opportunity**. Under poor connectivity, users need meaningful system feedback about the state of their interaction. This is especially important for task assignments, urgent instructions, status changes, and message delivery.

Ninth, the platform could support **post-event review** by preserving appropriate task and communication outcomes. This would allow the operational journey to extend beyond the moment when the event ends. However, the exact scope of post-event records should be established through subsequent requirements and privacy considerations rather than assumed at this stage.

Finally, the proposed journey creates a basis for **future usability evaluation under realistic conditions**. Moon et al. (2016) demonstrate the usefulness of journey mapping for identifying service opportunities, while Haugstveit et al. (2016) show that comparing intended and actual journeys can reveal gaps in service delivery. For this project, future evaluation should therefore examine not only whether users can complete individual tasks, but also whether they can maintain awareness, communicate effectively, and recover from changing conditions.

Overall, the journey analysis suggests that the central design opportunity is not simply to digitize existing event-management activities. It is to create a coherent operational experience in which ADMIN can maintain an event-level understanding of work while STAFF can receive, understand, execute, and update tasks with minimal unnecessary interaction. The two journeys must remain connected because information generated by one user group affects the situation awareness and decisions of the other.

The proposed journey models provide a conceptual structure for this interaction. They should not, however, be interpreted as evidence that the proposed design has already been validated. Further user testing, task-based evaluation, and testing under realistic event conditions would be required to determine whether the proposed interactions actually reduce cognitive and operational difficulties.

---

# 4. PROTOTYPE DESIGN

## 4.1 Design Goals
The prototype of the Event Management Platform is intended to translate the project's user requirements and HCI principles into a concrete interaction model that can be inspected, discussed, and subsequently evaluated. The prototype is not treated as a purely visual representation of the future application. Instead, it is a means of exploring how ADMIN and STAFF can obtain relevant information, perform operational tasks, communicate, and maintain awareness of the event state under realistic conditions.

The primary design goal is therefore to support operational effectiveness rather than visual decoration. The project establishes several principles that should guide the prototype: speed before decoration, role-based interfaces, relevant information at the right moment, reduced cognitive load, immediate feedback, clear system status, situation awareness, mobile interaction, one-handed use, accessibility, and reliable communication. These principles are particularly important because the platform is intended for live-event environments characterized by movement, noise, crowds, low light, multitasking, stress, fatigue, and changing priorities.

The first goal is speed and interaction efficiency. Users should be able to perform frequent operational actions without unnecessary navigation or interpretation. This is especially relevant to STAFF, who may interact with the system while walking, carrying equipment, or coordinating physical activities. The prototype should therefore minimize unnecessary steps between receiving an instruction and understanding what needs to be done.

The second goal is role-based interaction. ADMIN and STAFF should not simply receive the same interface with different permissions. Their operational responsibilities and information needs are different. ADMIN requires a broader view of the event, including team responsibility, task progress, priorities, and potential problems. STAFF requires a more focused view of current tasks, instructions, deadlines, and status actions. ISO 9241-210 (2019) emphasizes the importance of understanding users, tasks, and environments as part of human-centered design.

The third goal is situation awareness. Users should be able to understand the operational state relevant to their role. For ADMIN, this means understanding what is happening across the event. For STAFF, it means understanding what they need to do now and whether any relevant instruction or priority has changed. Endsley (1995) describes situation awareness as involving the perception and comprehension of information within dynamic environments and the ability to use that understanding to support subsequent action.

The fourth goal is accessibility and environmental robustness. The prototype should remain usable when the user is operating under conditions that are more difficult than a conventional office environment. The project specifically identifies low light, noise, distraction, movement, and stress as relevant conditions. WCAG 2.2 provides an important baseline for accessibility, including requirements concerning contrast, keyboard operation, focus, use of color, reflow, and target size (World Wide Web Consortium [W3C], 2024).

Finally, the prototype should provide clear system feedback. When a user assigns a task, changes a status, sends a communication, or performs another consequential action, the interface should make the resulting state understandable. This reduces uncertainty and supports coordination between users.

## 4.2 Design Rationale
The design rationale connects the prototype decisions to documented user problems rather than treating visual design as an independent activity. Each major decision can be understood through four elements: the user problem, the proposed design decision, the HCI rationale, and the expected benefit. Because the visual prototype has not yet been validated, these benefits should be understood as expected outcomes rather than demonstrated results.

## 4.3 Information Architecture
The information architecture should organize the application around operational activities rather than around a long list of software features. The project's core information objects include events, areas, teams, staff members, roles, tasks, deadlines, statuses, assignments, instructions, messages, substitutions, activity/history, and audience content.

A proposed high-level structure is therefore based on the relationship between:
Event $\rightarrow$ Area/Team $\rightarrow$ Staff/Role $\rightarrow$ Task $\rightarrow$ Instruction $\rightarrow$ Status $\rightarrow$ History.

This structure reflects the operational relationships that users need to understand.

For ADMIN, the information architecture should support questions such as:
* What is happening right now?
* Which areas are covered?
* Who is responsible?
* Which tasks are pending?
* Which tasks are delayed?
* What has been completed?
* Who needs an instruction?
* What communication has occurred?
* Is a substitution required?

For STAFF, the architecture should answer a smaller set of immediate questions:
* What is my current task?
* What is its priority?
* When is it due?
* What do I need to do?
* Do I need to acknowledge or update status?
* Has the instruction changed?

This difference is important because information architecture should not be identical simply because both users access the same underlying system.

## 4.5 Wireframes
Wireframes provide more structure than sketches while still allowing the team to focus on information architecture and interaction. They should demonstrate the relationship between content, controls, navigation, and screen hierarchy without being interpreted as the final visual design.

## 4.6 High-Fidelity Prototype
The high-fidelity prototype should represent the proposed interaction with sufficient visual and interactive detail to evaluate hierarchy, readability, touch interaction, navigation, feedback, and accessibility.

However, because the final visual design has not yet been established, this report does not prescribe exact colors, typography values, iconography, screen dimensions, or final component placement.

The high-fidelity prototype should evolve from the low-fidelity and wireframe stages rather than introducing an unrelated visual system.

For ADMIN, the high-fidelity prototype should make it possible to examine whether event-level information can be understood quickly. The prototype may include proposed representations for task status, ownership, deadlines, communication, and delayed tasks.

For STAFF, the prototype should make it possible to examine whether a user can receive an instruction, understand its priority, perform the relevant action, update status, and communicate without excessive navigation.

The high-fidelity prototype should also represent system states, not only ideal successful states. At minimum, later prototype iterations should consider states such as:
* action successful;
* action unsuccessful;
* communication pending;
* communication delivered;
* task acknowledged;
* task delayed;
* task completed;
* information changed;
* network unavailable or degraded.

These states are particularly important because the project identifies uncertainty about communication delivery and network reliability as important concerns.

The inclusion of these states would allow the prototype to evaluate whether users can understand what the system is doing instead of simply assuming that every interaction succeeds.

The high-fidelity prototype should therefore be considered a testable design hypothesis, not a validated solution.

## 4.8 Accessibility Considerations
Accessibility is treated in this project as part of usability rather than as a separate concern. This is particularly important because the platform may be used in environments involving low light, movement, distraction, noise, and stress.

WCAG 2.2 provides the primary accessibility reference for the prototype (W3C, 2024).

## 4.11 Navigation
Navigation should reflect the different operational contexts of ADMIN and STAFF.

A desktop-oriented navigation structure should not simply be copied onto mobile. The project explicitly identifies STAFF smartphone use, one-handed interaction, movement, and minimal navigation as important requirements.

## 4.13 Responsive and Mobile Interaction
Responsive design is especially important because the project anticipates smartphones, tablets, and computers. However, responsiveness should not mean simply scaling the same interface to different screen sizes.

The interaction context changes between devices.

STAFF smartphone use may involve:
* one-handed operation;
* walking;
* carrying equipment;
* crowded environments;
* reduced attention;
* rapid status updates.

ADMIN may have access to larger screens that support broader event-level visibility and greater information density.

The prototype should therefore explore responsive adaptation, not only responsive resizing.

# 6. TESTING PLAN

## 6.1 Testing Objectives
The usability testing plan is designed to determine whether the proposed Event Management Platform actually addresses the project's central operational problems rather than merely providing an interface that is visually understandable. According to ISO 9241-11 (2018), usability must be considered in relation to users, goals, and context of use. This is particularly important for the present project because ADMIN and STAFF operate under different responsibilities and environmental conditions.

The platform is intended to reduce communication friction, cognitive workload, uncertainty about task ownership, and difficulty maintaining operational awareness during live events. The project context describes conditions including movement, multitasking, time pressure, noise, low-light environments, fatigue, changing priorities, and unreliable connectivity. Therefore, testing should evaluate the interface under representative scenarios rather than only asking participants whether they like the design.

The primary objectives are to determine whether:
1. Communication is sufficiently fast and understandable for operational coordination.
2. STAFF can understand assigned tasks, including their priority and deadline.
3. ADMIN can identify the current state of work and determine who is responsible for specific tasks.
4. Users can complete representative tasks successfully without unnecessary assistance.
5. Task ownership is sufficiently visible to support coordination.
6. Task status is sufficiently visible to support situation awareness.
7. Navigation is sufficiently simple for both roles.
8. The interface reduces unnecessary cognitive processing, memory demands, and decision-making.
9. Important interaction errors are prevented or recoverable.
10. Users receive immediate and understandable feedback after important actions.
11. STAFF can use the interface effectively on a mobile device.
12. The interface satisfies relevant accessibility requirements, including adequate target size, contrast, visible focus, and non-color-dependent information.
13. Users correctly understand communication states, particularly whether an operational communication has been initiated, processed, delivered, or has encountered an error where those states are implemented.

These objectives correspond to the project's stated UX priorities of speed, clarity, simplicity, immediate feedback, low cognitive load, task completion, communication reliability, situation awareness, role-specific information, and responsiveness. The project specifically identifies ADMIN as requiring broad coordination and monitoring capabilities and STAFF as requiring fast, mobile-oriented interaction while moving through the event environment.

The testing process should therefore provide both quantitative evidence of effectiveness and efficiency and qualitative evidence explaining why participants succeed or encounter difficulty.

## 6.2 Participants
The study should use separate participant groups representing the two primary operational roles: ADMIN-like users and STAFF-like users. The purpose is not to treat these groups as two versions of the same user with different permissions. Their responsibilities, information requirements, and physical contexts are different.

## 6.4 Test Tasks
The evaluation should use task-based scenarios rather than asking participants to freely explore the application. Each task should represent a realistic operational objective.

The exact tasks must be adapted to the final prototype once its screens, navigation, and communication states are finalized. The following therefore represent the proposed testing task set, not finalized product requirements.

## 6.5 Metrics
The evaluation should combine quantitative and qualitative measurements. ISO 9241-11 (2018) provides the general foundation for considering usability in terms of effectiveness, efficiency, and satisfaction, while Sauro and Lewis (2012) provide methodological guidance for quantitative user-experience measurement.

## 6.6 Testing Protocol
The testing session should follow a consistent sequence so that results can be compared across participants.

* **Step 1 – Introduction:** The researcher explains the purpose of the study, what the participant will do, approximate session structure, and that the prototype is being evaluated rather than the participant. The moderator should avoid explaining how to perform the tasks because doing so could invalidate the measurement.
* **Step 2 – Informed consent:** Before testing begins, participants should receive the consent information described in Section 6.9. If audio, video, screen recording, or photographs are collected, this should be explicitly stated before participation.
* **Step 3 – Context and scenario:** Participants receive a short scenario appropriate to their role. For example: "You are STAFF working during a live event. Several operational tasks are being coordinated through the platform. You have just received a new instruction." The scenario should establish context without telling the participant which interface elements to use.
* **Step 4 – Task instructions:** Tasks should be presented individually. Instructions should describe the goal, not the solution. For example: "A task assigned to you has become urgent. Determine what you need to do and update the system accordingly." The moderator should not say: "Click the red button labeled Update" because this would test whether participants can follow instructions rather than whether the interface communicates the correct action.
* **Step 5 – Observation:** The moderator records completion, time, errors, navigation, assistance, hesitation, unexpected behaviors, and comments. The moderator should avoid intervening unless the study protocol explicitly permits assistance.
* **Step 6 – Think-aloud:** Think-aloud may be used during formative testing, particularly when the objective is to understand why participants interpret an interface incorrectly (Ericsson & Simon, 1993). However, it should not necessarily be required for every task. Continuous verbalization could interfere with natural task performance, especially in time-sensitive STAFF scenarios. A practical approach is therefore: use think-aloud heavily during early formative testing; reduce its use when measuring realistic task speed; and rely more heavily on observation and post-task questioning during later testing.
* **Step 7 – Questionnaire:** After the task sequence, participants complete the selected questionnaire(s), such as SUS and, if adopted, NASA-TLX.
* **Step 8 – Debrief:** The researcher asks participants about the most difficult task, easiest task, confusing information, missing information, communication clarity, mobile interaction, perceived workload, and improvements they would make. The participant should also have an opportunity to clarify observations without being pressured to justify their actions.

## 6.7 Questionnaires

## 6.8 Success Criteria
The project should not claim that the system is successful before testing occurs. Instead, the study should establish proposed evaluation criteria against which observed results can later be interpreted.

The following thresholds are therefore proposed study criteria, not validated findings.

## 6.9 Ethical Considerations
The study involves human participants and should therefore use an informed and voluntary participation process.

## 6.10 Limitations
The proposed testing plan has several limitations that must be acknowledged when interpreting results.
# 5. ENGINEERING DECISIONS

## 5.1 Decision-Making Framework

Engineering decisions are treated as responses to identified user needs rather than as isolated implementation preferences. The design must therefore preserve a traceable chain: **documented user/context problem → requirement or design implication → HCI rationale → proposed interface behavior → implementation consideration → measurable evaluation criterion**. This approach prevents the report from presenting a design preference as if it were an empirically validated result.

The project also distinguishes between three evidence levels. **Documented project evidence** comes from the supplied personas, empathy maps, project context, and existing project requirements. **External research** provides theoretical or methodological support. **Design proposals** are interpretations of those inputs and remain subject to prototype evaluation. Conditional features—such as audio communication, audience no-login access, detailed substitution workflows, and offline behavior—remain explicitly unresolved unless implemented and evaluated.

## 5.2 Consolidated HCI-to-Engineering Decision Matrix

| HCI / Human-factors basis | Engineering decision | Interface implication | Evaluation implication |
|---|---|---|---|
| Nielsen: visibility of system status | Represent meaningful task and communication states explicitly | Users can distinguish pending, active, delayed, completed, and relevant delivery states | Measure state-identification accuracy and errors |
| Nielsen: recognition rather than recall | Keep critical operational information visible | STAFF sees task, priority, deadline, and instruction together; ADMIN sees ownership and operational status | Measure search/navigation errors and comprehension |
| Norman: signifiers, mapping, feedback, constraints | Use controls whose labels and effects correspond to the user's operational model | Actions such as acknowledge, update, assign, and communicate should have clear outcomes | Observe hesitation, misinterpretation, and recovery |
| Fitts' Law | Give frequently used touch controls adequate size and reachable placement | STAFF's primary actions should be easy to target with one hand where feasible | Measure targeting errors and task completion time |
| Hick's Law | Avoid presenting unnecessary choices during time-sensitive actions | Prioritize the small set of actions relevant to the current task | Measure decision/navigation time and incorrect choices |
| Gestalt grouping | Visually group information that belongs to the same operational object | Task, owner, priority, deadline, and status should read as a coherent unit | Measure interpretation and search behavior |
| Cognitive Load Theory | Reduce unnecessary information search and memory demands | Role-specific information density and predictable interaction patterns | Combine behavioral measures with optional workload measurement |
| Situation awareness | Present information needed to perceive and understand relevant operational state | ADMIN receives broader event-level visibility; STAFF receives focused task-level awareness | Test identification of priorities, ownership, changes, and status |
| WCAG 2.2 | Treat accessibility as an implementation constraint, not decoration | Contrast, non-color status, focus, reflow, labels, and pointer targets are testable requirements | Conduct accessibility inspection in addition to user testing |
| ISO 9241-11 / 210 | Evaluate usability in context and iterate through human-centred design | Design decisions remain hypotheses until evaluated with representative tasks | Assess effectiveness, efficiency, satisfaction, and context of use |

This matrix replaces the previous repeated treatment of each HCI theory as a standalone essay. The theories are retained where they change an engineering decision; explanations that did not affect a concrete design or evaluation decision have been removed.

## 5.3 Role-Based Architecture

ADMIN and STAFF require different interaction structures because their operational responsibilities differ. ADMIN needs broader event-level visibility, delegation, monitoring, intervention, and post-event review. STAFF needs a focused representation of current work, priority, deadline, instructions, status, and communication. The system should therefore share underlying concepts—such as tasks, roles, status, and communication—without forcing the two roles into an identical interface.

This is not simply a permissions problem. Role-based design affects information hierarchy, navigation depth, interaction frequency, device assumptions, and cognitive workload. A shared data model can support both experiences, while the presentation and available primary actions remain role-sensitive.

## 5.4 State and Feedback Model

The platform should make operational state observable. At minimum, the design should be capable of representing the states required by the selected prototype and implementation: task assignment, acknowledgement where applicable, progress/status, completion, delay, changed instruction, and communication status. The exact state machine remains an implementation decision and should not be inferred from this report alone.

The key engineering requirement is that a user should not have to infer whether an important action succeeded. If a network-dependent action is pending or fails, the interface should communicate that state instead of presenting an ambiguous success condition. This directly connects Nielsen's visibility-of-system-status principle with the project's documented concern about unreliable connectivity.

## 5.5 Responsive and Mobile Interaction

STAFF interaction is expected to be strongly mobile-oriented. Responsive behavior should therefore reorganize information rather than merely scale a desktop layout down. The mobile presentation should retain the information necessary for immediate work and keep high-frequency actions reachable. ADMIN may require a broader view on larger screens, but the same operational concepts should remain semantically consistent across devices.

Touch-target guidance should be treated as a baseline, not as proof that an interface is usable. WCAG 2.2 Success Criterion 2.5.8 establishes a minimum pointer target size of 24 × 24 CSS pixels subject to exceptions; operationally important controls may warrant larger targets after prototype testing. Research on one-handed interaction further supports considering target size and location when designing mobile interactions (Lee et al., 2019; Park & Han, 2010).

## 5.6 Accessibility Engineering

Accessibility requirements should be incorporated into component and interaction design. Status must not depend on color alone; text or another redundant cue should communicate the meaning. Text and controls must remain perceivable at appropriate contrast. Keyboard operation and visible focus are relevant to ADMIN interfaces used on larger devices, while touch interaction and reflow are particularly important for STAFF.

Accessibility should be verified against the applicable WCAG 2.2 success criteria rather than claimed from visual appearance. The final evaluation should therefore combine an accessibility inspection with role-specific usability testing.

## 5.7 Connectivity and Degraded Operation

Unreliable connectivity is a documented project concern, but the final offline/degraded-mode behavior is unresolved. The engineering implication is therefore not to invent an offline architecture, but to make communication and synchronization states explicit and to define the final behavior before implementation is treated as complete.

Questions that require an implementation decision include whether actions can be queued, how conflicts are handled, how users are informed of stale information, which actions require confirmation, and what happens when synchronization fails. These decisions should be tested because the perceived reliability of communication depends on both backend behavior and the interface's representation of that behavior.

## 5.8 Design Trade-offs

The design intentionally accepts several trade-offs. Greater ADMIN visibility increases information density; greater STAFF focus can reduce access to secondary information. Confirmation can prevent consequential errors but can slow experienced users. Strong notification filtering can reduce overload but can hide information that a user considers important. Larger touch targets improve accessibility and accuracy but consume screen space. These trade-offs should be resolved through iterative testing rather than through universal rules.

## 5.9 Engineering Traceability Summary

The engineering strategy can therefore be summarized as follows: **preserve role differences, expose meaningful system state, prioritize current operational information, design mobile interaction for STAFF, apply accessibility as a testable requirement, treat connectivity behavior explicitly, and validate trade-offs through usability testing.**

---

# 7. REFERENCES

The reference list below consolidates sources used in the revised report. Duplicate section-level reference lists and unsupported citation-export markers have been removed. Bibliographic metadata and DOI information were checked against publisher, DOI, institutional, or bibliographic records where available.

Bangor, A., Kortum, P. T., & Miller, J. T. (2008). An empirical evaluation of the System Usability Scale. *International Journal of Human-Computer Interaction, 24*(6), 574–594. https://doi.org/10.1080/10447310802205776

Brooke, J. (1996). SUS: A “quick and dirty” usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189–194). Taylor & Francis. https://doi.org/10.1201/9781498710411

Cooke, N. J., Gorman, J. C., Myers, C. W., & Duran, J. L. (2013). Interactive team cognition. *Cognitive Science, 37*(2), 255–285. https://doi.org/10.1111/cogs.12009

Durso, F. T., & Sethumadhavan, A. (2008). Situation awareness: Understanding dynamic environments. *Human Factors, 50*(3), 442–448. https://doi.org/10.1518/001872008X288448

Endsley, M. R. (1995). Toward a theory of situation awareness in dynamic systems. *Human Factors, 37*(1), 32–64. https://doi.org/10.1518/001872095779049543

Ericsson, K. A., & Simon, H. A. (1993). *Protocol analysis: Verbal reports as data* (Rev. ed.). MIT Press. https://doi.org/10.7551/mitpress/5657.001.0001

Fitts, P. M. (1954). The information capacity of the human motor system in controlling the amplitude of movement. *Journal of Experimental Psychology, 47*(6), 381–391. https://doi.org/10.1037/h0055392

Hart, S. G., & Staveland, L. E. (1988). Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research. In P. A. Hancock & N. Meshkati (Eds.), *Human mental workload* (pp. 139–183). North-Holland. https://doi.org/10.1016/S0166-4115(08)62386-9

Haugstveit, I. M., Halvorsrud, R., & Karahasanovic, A. (2016). Supporting redesign of C2C services through customer journey mapping. In *ServDes 2016: Service Design Geographies*. https://doi.org/10.21606/servdes2016.4

Hick, W. E. (1952). On the rate of gain of information. *Quarterly Journal of Experimental Psychology, 4*(1), 11–26. https://doi.org/10.1080/17470215208416600

Hollnagel, E. (2021). The changing nature of task analysis. In G. Salvendy & W. Karwowski (Eds.), *Handbook of human factors and ergonomics* (5th ed., pp. 358–367). Wiley. https://doi.org/10.1002/9781119636113.ch13

International Organization for Standardization. (2018). *ISO 9241-11:2018 Ergonomics of human-system interaction—Part 11: Usability: Definitions and concepts*. https://www.iso.org/standard/63500.html

International Organization for Standardization. (2019). *ISO 9241-210:2019 Ergonomics of human-system interaction—Part 210: Human-centred design for interactive systems*. https://www.iso.org/standard/77520.html

International Organization for Standardization. (2025). *ISO 9241-112:2025 Ergonomics of human-system interaction—Part 112: Principles for the presentation of information*. https://www.iso.org/standard/87518.html

Lee, S. C., Cha, M. C., & Ji, Y. G. (2019). Investigating smartphone touch area with one-handed interaction: Effects of target distance and direction on touch behaviors. *International Journal of Human-Computer Interaction, 35*(16), 1532–1543. https://doi.org/10.1080/10447318.2018.1554320

Lemon, K. N., & Verhoef, P. C. (2016). Understanding customer experience throughout the customer journey. *Journal of Marketing, 80*(6), 69–96. https://doi.org/10.1509/jm.15.0420

Moon, H., Han, S. H., Chun, J., & Hong, S. W. (2016). A design process for a customer journey map: A case study on mobile services. *Human Factors and Ergonomics in Manufacturing & Service Industries, 26*(4), 501–514. https://doi.org/10.1002/hfm.20673

Nielsen, J. (1994). Enhancing the explanatory power of usability heuristics. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems* (pp. 152–158). Association for Computing Machinery. https://doi.org/10.1145/191666.191729

Norman, D. A. (2013). *The design of everyday things: Revised and expanded edition*. Basic Books.

Park, Y. S., & Han, S. H. (2010). One-handed thumb interaction of mobile devices from the input accuracy perspective. *International Journal of Industrial Ergonomics, 40*(6), 746–756. https://doi.org/10.1016/j.ergon.2010.08.001

Patrício, L., Fisk, R. P., & Falcão e Cunha, J. (2008). Designing multi-interface service experiences: The service experience blueprint. *Journal of Service Research, 10*(4), 318–334. https://doi.org/10.1177/1094670508314264

Pruitt, J., & Adlin, T. (2006). *The persona lifecycle: Keeping people in mind throughout product design*. Morgan Kaufmann. https://doi.org/10.1016/B978-0-12-566251-2.X5000-X

Rosenbaum, M. S., Otalora, M. L., & Ramírez, G. C. (2017). How to create a realistic customer journey map. *Business Horizons, 60*(1), 143–150. https://doi.org/10.1016/j.bushor.2016.09.010

Rubin, J., & Chisnell, D. (2008). *Handbook of usability testing: How to plan, design, and conduct effective tests* (2nd ed.). Wiley.

Salmon, P. M., Stanton, N. A., Walker, G., Jenkins, D. P., & Rafferty, L. (2010). Is it really better to share? Distributed situation awareness and its implications for collaborative system design. *Theoretical Issues in Ergonomics Science, 11*(1–2), 58–83. https://doi.org/10.1080/14639220903009953

Sauro, J., & Lewis, J. R. (2012). *Quantifying the user experience: Practical statistics for user research*. Morgan Kaufmann. https://doi.org/10.1016/C2010-0-65192-3

Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science, 12*(2), 257–285. https://doi.org/10.1207/s15516709cog1202_4

van den Oever, F., & Schraagen, J. M. (2021). Team communication patterns in critical situations. *Journal of Cognitive Engineering and Decision Making, 15*(1), 28–51. https://doi.org/10.1177/1555343420986657

Vendelø, M. T., & Rerup, C. (2020). Collective mindfulness in a regenerating organization: Ethnographic evidence from Roskilde Festival. *Safety Science, 123*, 104537. https://doi.org/10.1016/j.ssci.2019.104537

Wagemans, J., Elder, J. H., Kubovy, M., Palmer, S. E., Peterson, M. A., Singh, M., & von der Heydt, R. (2012). A century of Gestalt psychology in visual perception: I. Perceptual grouping and figure-ground organization. *Psychological Bulletin, 138*(6), 1172–1217. https://doi.org/10.1037/a0029333

Wickens, C. D. (2008). Multiple resources and mental workload. *Human Factors, 50*(3), 449–455. https://doi.org/10.1518/001872008X288394

World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/wcag/

---

# 8. APPENDICES

## Appendix A — Proposed Interview Questions

**Status:** Proposed instrument. No interview responses are reported.

### ADMIN interview
1. How do you currently know what is happening across the event?
2. How do you assign and reassign responsibilities?
3. How do you determine whether a task is progressing, delayed, or complete?
4. What information do you need immediately when a problem occurs?
5. Which communication channels do you currently use, and where do they create friction?
6. How do changing priorities affect your work?
7. What information would you want to review after an event?
8. What information should remain visible while coordinating multiple teams?
9. What would make a coordination platform difficult to trust?
10. What would you change first in an existing event-management workflow?

### STAFF interview
1. How do you normally receive instructions during an event?
2. What makes an instruction easy or difficult to understand quickly?
3. How do you know which task is the highest priority?
4. How do you report progress, completion, or a problem?
5. What information do you need while moving or working with equipment?
6. Which existing tools or communication methods slow you down?
7. What makes a mobile interface difficult to use during an event?
8. What should happen when an instruction changes?
9. What kind of confirmation helps you know that an update was processed?
10. What would make the platform easier to use under stress?

## Appendix B — Persona Summary

### B.1 ADMIN — Silvana Delgadillo

| Attribute | Project-specific information |
|---|---|
| Role | Executive Producer / Admin Team Lead |
| Location | Puebla |
| Primary objective | Coordinate production and maintain operational control |
| Key responsibilities | Delegation, monitoring, communication, intervention, review |
| Main pain points | Communication friction, limited visibility, delegation/status-monitoring difficulty, limited post-event information |
| Relevant devices/tools | Software, social media, mobile applications, WhatsApp |
| Core UX implication | Broad event-level visibility with clear ownership, priority, status, and intervention paths |

### B.2 STAFF — Alexis Diaz

| Attribute | Project-specific information |
|---|---|
| Role | Concert/event staff |
| Location | Puebla |
| Primary objective | Execute assigned operational work quickly and correctly |
| Main pain points | Stress, changing workflow, fragmented applications, confusing interfaces, slow information |
| Device priority | Smartphone |
| Core UX implication | Focused task information, simple actions, large/reachable controls, rapid status communication |

These summaries are condensed from the supplied persona materials. They are not new research findings.

## Appendix C — ADMIN and STAFF Journey Maps

### C.1 ADMIN journey

**Understand event state → Identify gaps/priorities → Assign responsibility → Communicate → Monitor → Intervene → Close tasks → Review outcome**

| Stage | Goal | Main information | Main risk | Design opportunity |
|---|---|---|---|---|
| Understand | Know current event state | Tasks, teams, areas, status | Poor visibility | Event overview |
| Prioritize | Identify what needs attention | Priority, status, deadlines | Important issue buried | Exception/priority emphasis |
| Assign | Establish ownership | Staff, roles, responsibility | Unclear ownership | Visible assignment |
| Communicate | Give instructions | Recipient, instruction, priority | Fragmented communication | Direct communication |
| Monitor | Maintain awareness | Progress and status | Stale/unclear information | Central status view |
| Intervene | Resolve problems | Current state and owner | Delayed response | Direct intervention |
| Close | Confirm completion | Status/confirmation | Completion uncertainty | Immediate feedback |
| Review | Learn from event | History/outcomes | Poor post-event record | Retained operational information |

### C.2 STAFF journey

**Receive instruction → Understand priority → Execute task → Communicate/update status → Respond to changes → Complete task**

| Stage | Goal | Main information | Main risk | Design opportunity |
|---|---|---|---|---|
| Receive | Know assigned work | Task, sender, priority | Slow information | Immediate instruction visibility |
| Understand | Know what matters now | Priority, deadline | Confusion | Clear hierarchy |
| Execute | Complete work | Instruction and context | Cognitive overload | Focused task view |
| Update | Inform coordinator | Status | Communication friction | Quick status action |
| Adapt | Respond to changes | Updated instruction | Missed change | Immediate change feedback |
| Complete | Confirm work | Completion state | Unclear result | Explicit completion state |

These journeys are analytical syntheses and are not claims of validated behavioral frequency.

## Appendix D — Task Analysis

| Role | Task | Information required | Primary action | Critical usability concern |
|---|---|---|---|---|
| ADMIN | Identify delayed task | Status, deadline, task list | Select delayed task | Visibility and prioritization |
| ADMIN | Determine responsibility | Task, owner, area | Identify owner | Ownership clarity |
| ADMIN | Assign task | Task, staff, priority | Assign | Error prevention |
| ADMIN | Send instruction | Recipient, message, priority | Send | Communication feedback |
| ADMIN | Verify status | Delivery/task state | Interpret state | System-status visibility |
| STAFF | Receive instruction | Task, sender, priority | Open/interpret | Speed and comprehension |
| STAFF | Identify priority | Priority, deadline | Choose next action | Choice complexity |
| STAFF | View deadline | Task, deadline | Interpret | Recognition |
| STAFF | Acknowledge/update | Current task state | Update | Reachability and feedback |
| STAFF | Report problem | Problem context, recipient | Communicate | Low-friction communication |
| STAFF | Complete task | Task state | Mark/report completion | Clear outcome |

## Appendix E — Prototype Traceability Matrix

| User need/problem | Design response | HCI basis | Test evidence to collect |
|---|---|---|---|
| Fragmented communication | Central communication path and visible message state | Visibility of system status; team cognition | State interpretation, errors, assistance |
| Unclear ownership | Persistent owner/role information | Recognition; situation awareness | Ownership identification |
| ADMIN lacks event-wide visibility | Event-level overview and prioritized exceptions | Situation awareness; Gestalt | Priority identification |
| STAFF needs rapid task comprehension | Focused task view with priority/deadline/instruction | Cognitive load; recognition | Comprehension and completion |
| Mobile one-handed use | Reachable primary controls | Fitts' Law; mobile research | Targeting errors/time |
| Changing priorities | Visible priority and change feedback | Situation awareness; system status | Correct response to change |
| Accessibility under demanding conditions | Contrast, redundant status cues, focus, reflow, labels | WCAG 2.2 | Accessibility inspection + usability observations |
| Unreliable connectivity | Explicit pending/failure/delivery states | Visibility of system status | State interpretation under simulated degradation |

## Appendix F — Low-Fidelity Sketches

[Figure F1. ADMIN low-fidelity event overview — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate how the proposed sketch organizes event-level status, priorities, teams, and responsibilities without committing to final visual styling.*

[Figure F2. ADMIN task/assignment sketch — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate the relationship between a task, its owner, status, deadline, and assignment action.*

[Figure F3. STAFF current-task sketch — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate focused task information and the primary action needed by STAFF.*

[Figure F4. STAFF status/communication sketch — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate how a STAFF member can update status or communicate without unnecessary navigation.*

**Artifact status:** The actual project sketches were not present in the supplied report source. They must be inserted from the project files rather than reconstructed from assumptions.

## Appendix G — Wireframes

[Figure G1. ADMIN main wireframe — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate the proposed hierarchy between event state, priority problems, ownership, and task information.*

[Figure G2. ADMIN task management wireframe — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate task assignment, status, deadline, and intervention controls.*

[Figure G3. STAFF main task wireframe — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate a focused mobile layout for current task execution.*

[Figure G4. STAFF status/communication wireframe — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate rapid status communication and feedback.*

**Artifact status:** Placeholders remain because the supplied source did not contain the actual wireframe images.

## Appendix H — High-Fidelity Prototype Screenshots

[Figure H1. ADMIN event overview — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate the final visual hierarchy for event-level monitoring.*

[Figure H2. ADMIN task and team management — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate how ownership, task state, priority, and intervention are represented.*

[Figure H3. ADMIN communication/coordination — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate communication flow and visible system feedback.*

[Figure H4. STAFF current task — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate the final mobile hierarchy for task execution.*

[Figure H5. STAFF task status — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate how progress and completion are communicated.*

[Figure H6. STAFF updated instruction — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate how a changed instruction is surfaced without unnecessary cognitive effort.*

[Figure H7. Audience experience, if implemented — INSERT PROTOTYPE IMAGE HERE]

*The figure should demonstrate the secondary audience experience only if that feature exists in the final prototype.*

## Appendix I — Usability Testing Materials

### I.1 Proposed ADMIN tasks

| ID | Scenario | Participant goal | Measures |
|---|---|---|---|
| A1 | A task is delayed | Identify it | Completion, time, errors, assistance |
| A2 | A task needs attention | Identify responsible person | Completion, errors |
| A3 | A task must be delegated | Assign it | Completion, time, errors |
| A4 | A staff member needs an instruction | Send it | Completion, time, state understanding |
| A5 | An instruction/status needs verification | Interpret current state | Accuracy, errors |
| A6 | Replacement is required, if implemented | Identify substitution | Completion, interpretation |
| A7 | Completed work needs review | Find relevant completed tasks | Completion, navigation |

### I.2 Proposed STAFF tasks

| ID | Participant goal | Measures |
|---|---|---|
| S1 | Locate and understand an incoming instruction | Completion, comprehension |
| S2 | Determine which task is highest priority | Correct interpretation, time |
| S3 | Determine the deadline | Completion, navigation |
| S4 | Acknowledge a task, if implemented | Completion, errors |
| S5 | Update progress/completion | Completion, errors, feedback interpretation |
| S6 | Report a problem | Completion, communication clarity |
| S7 | Respond to a changed instruction | Correct adaptation, time |

### I.3 Proposed protocol

1. Explain the study and obtain consent.
2. Establish the participant's role and test scenario.
3. Present tasks as goals rather than click-by-click instructions.
4. Observe completion, time, errors, navigation, hesitation, and assistance.
5. Use think-aloud selectively during formative testing because continuous verbalization can interfere with time-sensitive STAFF interaction.
6. Administer the selected questionnaire after representative tasks.
7. Debrief and record qualitative comments.

No participant sample size or test result is asserted here. Recruitment and sample size should be determined according to the project's available participants and whether the study is formative or summative.

## Appendix J — Questionnaires and Data Record

### J.1 System Usability Scale

The final study may use the standard 10-item System Usability Scale after representative tasks. SUS should be analyzed separately for ADMIN and STAFF because their interfaces and responsibilities differ. The exact standardized questionnaire wording should be reproduced from the approved SUS instrument rather than paraphrased in the report.

### J.2 Optional NASA-TLX

NASA-TLX may be included if the team decides that perceived workload requires standardized measurement. It is an optional instrument, not a required project result.

### J.3 Post-test qualitative questions

1. Which task was easiest and why?
2. Which task was most difficult?
3. Was any important information difficult to find?
4. Did the interface make priorities clear?
5. Did task ownership/status remain understandable?
6. Did the communication feedback feel clear?
7. Did the interface feel appropriate for the intended event conditions?
8. What would you change first?

### J.4 Session record

| Field | Record |
|---|---|
| Participant ID | |
| Role | ADMIN / STAFF |
| Date | |
| Prototype version | |
| Moderator | |
| Task completion | |
| Time | |
| Errors | |
| Assistance | |
| Key observations | |
| SUS | |
| NASA-TLX, if used | |

---

# Editorial and Evidence Note

This second-pass edition deliberately removes duplicated explanations of the same HCI principles from User Analysis, Prototype Design, and Engineering Decisions. User Analysis establishes the evidence and requirements; Prototype Design translates those requirements into interface proposals; Engineering Decisions explains only the HCI principles that materially influence implementation; Testing Plan defines how those proposals would be evaluated. The appendices provide supporting instruments and placeholders rather than repeating the body of the report.

No interview responses, participant counts, usability scores, performance improvements, or empirical success claims have been added. Proposed thresholds—such as the possible 80% independent-completion criterion for critical tasks—remain explicitly identified as project evaluation criteria rather than universal standards.

The report also retains unresolved features as unresolved. Audio/walkie-talkie interaction, audience no-login access, detailed substitution behavior, exact notification policy, and final offline/degraded-mode behavior should not be described as implemented unless the project team has subsequently finalized and demonstrated them.
