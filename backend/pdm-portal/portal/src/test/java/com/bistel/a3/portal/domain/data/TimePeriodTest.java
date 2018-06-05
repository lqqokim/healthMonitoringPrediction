package com.bistel.a3.portal.domain.data;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.Date;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class TimePeriodTest {
	private Long from;
	private Long to;

	@InjectMocks
	private TimePeriod actual = new TimePeriod();

	@Test
	public final void testFrom() {
		Long from = 11111L;
		this.from = from;
		actual.setFrom(from);
		assertEquals(this.from, actual.getFrom());
	}
	@Test
	public final void testTo() {
		Long to = 22222L;
		this.to = to;
		actual.setTo(to);
		assertEquals(this.to, actual.getTo());
	}
	@Test
	public final void testFromDate() {
		Long from = 11111L;
		this.from = from;
		Date fromDate = new Date(this.from);
		actual.setFrom(from);

		assertEquals(fromDate, actual.getFromDate());
	}
	@Test
	public final void testToDate() {
		Long to = 22222L;
		this.to = to;
		Date toDate = new Date(this.to);
		actual.setTo(to);

		assertEquals(toDate, actual.getToDate());
	}
	public Date getFromDate() {
		return new Date(this.from);
	}

}
