import { useState } from 'react';
import { Plus, Users, Crown, Pencil, Armchair } from 'lucide-react';
import { useApp } from '../app/store';
import { Avatar, Modal, PageHeading, roleLabel } from '../components/ui';
import type { Role, Team, User } from '../domain/types';

export function PeoplePage({ teams = false }: { teams?: boolean }) {
  const { data } = useApp();
  const [editingUser, setEditingUser] = useState<User | 'new' | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | 'new' | null>(null);
  return (
    <>
      <PageHeading
        eyebrow="LAS PERSONAS DETRÁS DEL EVENTO"
        title={teams ? 'Un equipo, muchas manos.' : 'Personal del evento'}
        description={
          teams
            ? 'Organiza los equipos y define quién los coordina.'
            : 'Gestiona los integrantes, sus roles y su equipo.'
        }
        action={
          <button
            className="btn primary"
            onClick={() => (teams ? setEditingTeam('new') : setEditingUser('new'))}
          >
            <Plus size={17} />
            {teams ? 'Nuevo equipo' : 'Añadir persona'}
          </button>
        }
      />
      {teams ? (
        <div className="teams-grid">
          {data.teams.map((team) => {
            const members = data.users.filter((u) => u.teamId === team.id);
            const leader = members.find((u) => u.role === 'TEAM_LEADER');
            return (
              <section key={team.id} className="panel team-card">
                <div className="flex justify-between items-center">
                  <span
                    className="team-icon"
                    style={{ background: team.color + '25', color: team.color }}
                  >
                    <Users size={24} />
                  </span>
                  <button
                    className="icon-btn"
                    aria-label={`Editar equipo ${team.name}`}
                    onClick={() => setEditingTeam(team)}
                  >
                    <Pencil size={17} />
                  </button>
                </div>
                <h2>{team.name}</h2>
                <p className="muted">
                  {members.length} integrantes ·{' '}
                  {
                    data.tasks.filter((t) => t.teamId === team.id && t.status !== 'Completada')
                      .length
                  }{' '}
                  tareas activas
                </p>
                <div className="leader-line">
                  <Crown size={16} />
                  <span>{leader?.name ?? 'Sin líder asignado'}</span>
                </div>
                <div className="member-list">
                  {members.map((u) => (
                    <div key={u.id}>
                      <Avatar small name={u.name} />
                      <span>{u.name}</span>
                      <small>{u.role === 'TEAM_LEADER' ? 'Líder' : 'Staff'}</small>
                    </div>
                  ))}
                </div>
                {data.seatingTeamId === team.id && (
                  <span className="badge seating-badge">
                    <Armchair size={13} />
                    Responsable del conteo
                  </span>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <section className="panel">
          <div className="section-heading">
            <h2>
              Personas <span className="count-pill">{data.users.length}</span>
            </h2>
            <span className="muted small-text">Un equipo por persona</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Rol</th>
                  <th>Equipo</th>
                  <th>Tareas activas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="person-cell">
                        <Avatar name={u.name} />
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge role-badge">{roleLabel[u.role]}</span>
                    </td>
                    <td>{data.teams.find((t) => t.id === u.teamId)?.name ?? 'Administración'}</td>
                    <td>
                      {
                        data.tasks.filter((t) => t.assigneeId === u.id && t.status !== 'Completada')
                          .length
                      }
                    </td>
                    <td>
                      <button
                        className="btn text-btn"
                        aria-label={`Editar a ${u.name}`}
                        onClick={() => setEditingUser(u)}
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {editingUser && (
        <UserEditor
          user={editingUser === 'new' ? undefined : editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {editingTeam && (
        <TeamEditor
          team={editingTeam === 'new' ? undefined : editingTeam}
          onClose={() => setEditingTeam(null)}
        />
      )}
    </>
  );
}
function UserEditor({ user, onClose }: { user?: User; onClose: () => void }) {
  const { data, run, notice } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [role, setRole] = useState<Role>(user?.role ?? 'STAFF');
  const [teamId, setTeamId] = useState(user?.teamId ?? '');
  return (
    <Modal title={user ? 'Editar persona' : 'Añadir persona'} onClose={onClose}>
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (run({ type: 'saveUser', id: user?.id, name, role, teamId: teamId || null }))
            onClose();
        }}
      >
        <label>
          Nombre completo
          <input
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Rol
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {Object.entries(roleLabel).map(([r, label]) => (
              <option key={r} value={r}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {role !== 'ADMIN' && (
          <label>
            Equipo
            <select
              value={teamId}
              required={role === 'TEAM_LEADER'}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">Sin equipo</option>
              {data.teams.map((t) => (
                <option value={t.id} key={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {role === 'TEAM_LEADER' && (
          <p className="info-box">
            El líder puede consultar y coordinar su equipo. No puede crear ni asignar tareas. Al
            designarlo, el líder anterior pasa a STAFF.
          </p>
        )}
        {notice?.error && (
          <p className="field-error" role="alert">
            {notice.message}
          </p>
        )}
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn primary" type="submit">
            Guardar persona
          </button>
        </div>
      </form>
    </Modal>
  );
}
function TeamEditor({ team, onClose }: { team?: Team; onClose: () => void }) {
  const { data, run, notice } = useApp();
  const [name, setName] = useState(team?.name ?? '');
  const [leaderId, setLeaderId] = useState(
    data.users.find((u) => u.teamId === team?.id && u.role === 'TEAM_LEADER')?.id ?? '',
  );
  return (
    <Modal title={team ? 'Editar equipo' : 'Nuevo equipo'} onClose={onClose}>
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (run({ type: 'saveTeam', id: team?.id, name, leaderId: leaderId || null })) onClose();
        }}
      >
        <label>
          Nombre del equipo
          <input
            required
            minLength={2}
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {team && (
          <label>
            Líder
            <select value={leaderId} onChange={(e) => setLeaderId(e.target.value)}>
              <option value="">Sin líder</option>
              {data.users
                .filter((u) => u.teamId === team.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </label>
        )}
        <p className="info-box">
          Gestiona los integrantes desde Personal. Cada equipo tiene un canal de chat propio.
        </p>
        {notice?.error && (
          <p className="field-error" role="alert">
            {notice.message}
          </p>
        )}
        <div className="modal-actions">
          <button className="btn secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn primary" type="submit">
            Guardar equipo
          </button>
        </div>
      </form>
    </Modal>
  );
}
