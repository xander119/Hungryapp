package database.entity;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class MenuDAO {

	@PersistenceContext
	EntityManager em;
	
	public List<Menu> getMenu() {
		// TODO Auto-generated method stub
		List<Menu> m =  em.createNamedQuery("Menu.findById").getResultList();
		return m;
	}

	public Menu createMenu(Menu m, int restId) {
		// TODO Auto-generated method stub
		Restaurant r = (Restaurant) em.createNamedQuery("Restaurant.findById").setParameter("id", restId).getResultList().get(0);
		if(m!=null){
			
				m.setRestaurant(r);
				if(m.getItems()!=null){
					for(Item i : m.getItems()){
						i.setMenu(m);
					}
				
			}
			
			
			try {
				m = em.merge(m);
				em.flush();
				
			} catch (EntityExistsException  e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
				
			}
			return m;
		}
		return null;
	}

	public Menu updateMenu(Menu menu) {
		// TODO Auto-generated method stub
		return em.merge(menu);
	}

	public Menu getMenuById(int menuid) {
		// TODO Auto-generated method stub
		return em.find(Menu.class, menuid);
	}

	public void deleteMenu(int menuid) {
		// TODO Auto-generated method stub
		Menu removeMenu =getMenuById(menuid);
		if(removeMenu!=null){
			em.remove(removeMenu);
		}
	}

	public List<Menu> getMenuByRestId(int restid) {
		// TODO Auto-generated method stub
		List<Menu> m = em.createNamedQuery("Menu.findByRestId").setParameter("id", restid).getResultList();
		return m;
	}

}
