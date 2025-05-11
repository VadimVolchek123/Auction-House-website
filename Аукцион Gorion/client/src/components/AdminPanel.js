import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import { fetchAllAuctions, deleteAuction } from "../http/auctionAPI";
import { fetchAllUsers, deleteUser, updateUserRole } from "../http/userAPI";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("auctions");

  // Состояния для аукционов
  const [auctions, setAuctions] = useState([]);
  const [loadingAuctions, setLoadingAuctions] = useState(false);

  // Состояния для пользователей
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  // Состояние для хранения изменяемых ролей по user.id
  const [roleUpdates, setRoleUpdates] = useState({});

  // Общее состояние для ошибок
  const [error, setError] = useState("");

  // Загрузка аукционов при выборе вкладки "Аукционы"
  useEffect(() => {
    if (activeTab === "auctions") {
      loadAuctions();
    }
  }, [activeTab]);

  const loadAuctions = async () => {
    setLoadingAuctions(true);
    setError("");
    try {
      // Указываем page = 1, limit = 100
      const result = await fetchAllAuctions(1, 100);
      console.log("Результат fetchAllAuctions:", result);
      // Если API возвращает данные в result.rows, используем его, иначе result
      setAuctions(result.rows || result || []);
    } catch (err) {
      console.error("Ошибка получения аукционов:", err);
      setError("Ошибка загрузки аукционов.");
    } finally {
      setLoadingAuctions(false);
    }
  };

  // Загрузка пользователей при выборе вкладки "Пользователи"
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const result = await fetchAllUsers();
      console.log("Результат fetchAllUsers:", result);
      // Предполагаем, что API возвращает либо result.rows, либо result.users
      const fetchedUsers = result.rows || result.users || [];
      setUsers(fetchedUsers);
      // Инициализируем локальное состояние для обновления ролей
      const initialRoles = {};
      fetchedUsers.forEach((user) => {
        initialRoles[user.id] = user.role;
      });
      setRoleUpdates(initialRoles);
    } catch (err) {
      console.error("Ошибка получения пользователей:", err);
      setError("Ошибка загрузки пользователей.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteAuction = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот аукцион?")) {
      try {
        await deleteAuction(id);
        loadAuctions();
      } catch (err) {
        console.error("Ошибка удаления аукциона:", err);
        setError("Ошибка удаления аукциона.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (err) {
        console.error("Ошибка удаления пользователя:", err);
        setError("Ошибка удаления пользователя.");
      }
    }
  };

  // Обработчик изменения выбранной роли для пользователя
  const handleRoleChange = (userId, newRole) => {
    setRoleUpdates((prev) => ({ ...prev, [userId]: newRole }));
  };

  // Обновление роли пользователя (выполняется через API; сервер проверяет, что текущий пользователь – администратор)
  const handleUpdateUserRole = async (userId) => {
    const newRole = roleUpdates[userId];
    try {
      await updateUserRole({ userId, role: newRole });
      loadUsers();
    } catch (err) {
      console.error("Ошибка обновления роли для пользователя:", err);
      setError("Ошибка обновления роли.");
    }
  };

  return (
    <Container className="mt-5">
      <Tabs
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        id="admin-panel-tabs"
        className="mb-3"
      >
        <Tab eventKey="auctions" title="Аукционы">
          {loadingAuctions ? (
            <Spinner animation="border" role="status" />
          ) : error ? (
            <Alert variant="danger" className="mt-3">{error}</Alert>
          ) : (
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ID продукта</th>
                  <th>Стартовая цена</th>
                  <th>Резервная цена</th>
                  <th>Начало</th>
                  <th>Конец</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(auctions) &&
                  auctions.map((auction) => (
                    <tr key={auction.id || auction.auctionId}>
                      <td>{auction.id || auction.auctionId}</td>
                      <td>{auction.productId}</td>
                      <td>{auction.startingPrice || auction.starting_price}</td>
                      <td>{auction.reservePrice || auction.reserve_price}</td>
                      <td>{new Date(auction.startTime || auction.start_time).toLocaleString()}</td>
                      <td>{new Date(auction.endTime || auction.end_time).toLocaleString()}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleDeleteAuction(auction.id || auction.auctionId)
                          }
                        >
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="users" title="Пользователи">
          {loadingUsers ? (
            <Spinner animation="border" role="status" />
          ) : error ? (
            <Alert variant="danger" className="mt-3">{error}</Alert>
          ) : (
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) &&
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Form.Select
                          value={roleUpdates[user.id]}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          size="sm"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleUpdateUserRole(user.id)}
                        >
                          Обновить роль
                        </Button>{" "}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;
