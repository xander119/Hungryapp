package webService;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import database.entity.Menu;
import database.entity.MenuDAO;

@Path("/menus")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class MenusServices {
	@EJB
	private MenuDAO menuDao;

	@POST
	@Path("/createMenu")
	public void createNewMenu(Menu m) {

	}

	@PUT
	@Path("/updateMenu/{menuid}")
	public void updateMenu(@PathParam("menuid") int menuid) {

	}

	@GET
	@Path("/{menuid}")
	public Menu getMenuById(@PathParam("menuid") int menuid) {
		return null;

	}
	@DELETE
	@Path("/delete/{menuid}")
	public void deleteMenu(@PathParam("menuid") int menuid){
		
	}
}
