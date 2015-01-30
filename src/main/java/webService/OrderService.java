package webService;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/order")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class OrderService {

}
